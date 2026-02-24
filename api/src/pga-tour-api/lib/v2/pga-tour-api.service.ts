import { gunzipSync, inflateSync, unzipSync } from 'zlib';

import { GraphQLClient } from 'graphql-request';
import { lastValueFrom } from 'rxjs';

import { getSdk, ScheduleQuery, Sdk, TournamentsQuery } from './generated/graphql';
import { InjectPgaTourApiConfig, PgaTourApiConfig } from './pga-tour-api.config';
import {
  PgaApiPlayer,
  PgaApiPlayerSeasonResultsResponse,
  PgaApiPlayersResponse,
  PgaApiProjectedFedexCupPointsResponse,
  PgaApiTournamentLeaderboardResponse,
  PgaApiTournamentLeaderboardRow,
} from './pga-tour-api.interface';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PgaTourApiService {
  private sdk: Sdk;

  constructor(
    private readonly httpClient: HttpService,
    @InjectPgaTourApiConfig()
    private readonly pgaTourApiConfig: PgaTourApiConfig
  ) {
    const gqlClient = new GraphQLClient(this.pgaTourApiConfig.PGA_TOUR_API_GQL_URL, {
      headers: {
        'X-Api-Key': this.pgaTourApiConfig.PGA_TOUR_API_GQL_API_KEY,
        'x-pgat-platform': 'web',
      },
    });
    this.sdk = getSdk(gqlClient);
  }

  async getPlayers(onlyActive: boolean): Promise<PgaApiPlayer[]> {
    const url = `https://data-api.pgatour.com/player/list/R`;
    const response$ = this.httpClient.get<PgaApiPlayersResponse>(url);
    const response = await lastValueFrom(response$).then((res) => res.data);
    const players = response.players ?? [];

    return onlyActive ? players.filter((player) => player.isActive) : players;
  }

  async getPlayerSeasonResults(
    playerId: number | string,
    season?: number
  ): Promise<PgaApiPlayerSeasonResultsResponse> {
    const seasonParam = season ? `&season=${season}` : '';
    const url = `https://data-api.pgatour.com/player/profiles/${playerId}/results/season?tour=R${seasonParam}`;
    const response$ = this.httpClient.get<PgaApiPlayerSeasonResultsResponse>(url);
    return await lastValueFrom(response$).then((res) => res.data);
  }

  async getTournamentSchedule(year: number): Promise<ScheduleQuery['schedule']> {
    const response = await this.sdk.Schedule({
      tourCode: 'R',
      year: String(year),
    });

    return response.schedule;
  }

  async getTournaments(tournamentIds: string[]): Promise<TournamentsQuery['tournaments']> {
    const response = await this.sdk.Tournaments({ ids: tournamentIds });

    return response.tournaments;
  }

  async getTournamentLeaderboard(
    year: string | number,
    tournamentId: string
  ): Promise<PgaApiTournamentLeaderboardResponse> {
    const leaderboardId = `R${year}${tournamentId}`;
    const response = await this.sdk.LeaderboardCompressedV3({
      leaderboardCompressedV3Id: leaderboardId,
    });

    const payload = response.leaderboardCompressedV3?.payload;
    if (!payload) {
      throw new Error(`Missing leaderboard payload for ${leaderboardId}`);
    }

    const decoded = this.decodeCompressedPayload(payload);
    const { leaderboard, leaderboardId: decodedLeaderboardId } =
      this.extractLeaderboardFromPayload(decoded);

    if (!leaderboard) {
      throw new Error(`Could not parse leaderboard players for ${leaderboardId}`);
    }

    return {
      leaderboardId: decodedLeaderboardId ?? leaderboardId,
      leaderboard: {
        ...leaderboard,
        players: this.normalizeLeaderboardPlayers(leaderboard.players ?? []),
      },
    } as PgaApiTournamentLeaderboardResponse;
  }

  async getProjectedFedexCupPoints(
    year: number,
    tournamentId: string
  ): Promise<PgaApiProjectedFedexCupPointsResponse> {
    const response = await this.sdk.TourCupSplit({
      tourCode: 'R',
      id: '02671',
      year,
      eventQuery: null,
    });

    const projectedPlayers = response.tourCupSplit?.projectedPlayers ?? [];
    const projectedTournamentId = `R${year}${tournamentId}`;

    return {
      seasonYear: year,
      lastUpdated: new Date().toISOString(),
      points: projectedPlayers
        .filter((player) => player.__typename === 'TourCupCombinedPlayer')
        .map((player) => {
          if (player.__typename !== 'TourCupCombinedPlayer') {
            throw new Error('Unexpected player type');
          }
          return {
            playerId: player.id,
            firstName: player.firstName,
            lastName: player.lastName,
            tournamentId: projectedTournamentId,
            tournamentName: '',
            playerPosition: '',
            projectedEventPoints: player.pointData?.event ?? '0',
          };
        }),
    };
  }

  private decodeCompressedPayload(payload: string): unknown {
    const buf = Buffer.from(payload, 'base64');
    const input = Uint8Array.from(buf);
    const decode = (fn: (input: Uint8Array) => Buffer) => fn(input).toString('utf8');

    try {
      return JSON.parse(decode((input) => gunzipSync(input)));
    } catch (e) {
      // Fall back to alternate zlib formats in case PGA changes compression.
    }

    try {
      return JSON.parse(decode((input) => unzipSync(input)));
    } catch (e) {
      // Continue to final fallback.
    }

    try {
      return JSON.parse(decode((input) => inflateSync(input)));
    } catch (e) {
      throw new Error(`Failed to decode leaderboard payload: ${e}`);
    }
  }

  private extractLeaderboardFromPayload(payload: unknown): {
    leaderboard?: PgaApiTournamentLeaderboardResponse['leaderboard'];
    leaderboardId?: string;
  } {
    const root = this.asRecord(payload);
    if (!root) {
      return {};
    }

    const leaderboardId =
      (typeof root.leaderboardId === 'string' && root.leaderboardId) ||
      (typeof root.id === 'string' && root.id) ||
      undefined;
    const candidates = [
      root.leaderboard,
      this.asRecord(root.data)?.leaderboard,
      this.asRecord(root.leaderboardCompressedV3)?.leaderboard,
      this.asRecord(root.leaderboardV3)?.leaderboard,
      root.leaderboardV3,
      root,
    ];

    for (const candidate of candidates) {
      const leaderboard = this.asRecord(candidate);
      if (leaderboard && Array.isArray(leaderboard.players)) {
        return {
          leaderboard: leaderboard as PgaApiTournamentLeaderboardResponse['leaderboard'],
          leaderboardId,
        };
      }
    }

    return { leaderboardId };
  }

  private normalizeLeaderboardPlayers(
    players: Array<PgaApiTournamentLeaderboardRow | { __typename?: string }>
  ): PgaApiTournamentLeaderboardRow[] {
    return players.filter(this.isLeaderboardPlayerRow);
  }

  private isLeaderboardPlayerRow(
    row: PgaApiTournamentLeaderboardRow | { __typename?: string }
  ): row is PgaApiTournamentLeaderboardRow {
    if (!row || typeof row !== 'object') {
      return false;
    }

    const candidate = row as Record<string, unknown>;
    if (candidate.__typename === 'InformationRow') {
      return false;
    }

    return (
      typeof candidate.id === 'string' &&
      /^\d+$/.test(candidate.id) &&
      typeof candidate.player === 'object' &&
      typeof candidate.scoringData === 'object'
    );
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }

    return null;
  }
}
