import { gql, GraphQLClient } from 'graphql-request';
import { parse } from 'node-html-parser';
import { lastValueFrom } from 'rxjs';

import {
  PgaApiPlayer,
  PgaApiPlayersResponse,
  PgaApiProjectedFedexCupPointsResponse,
  PgaApiTournamentLeaderboardResponse,
  PgaApiTournamentScheduleResponse,
} from './pga-tour-api.interface';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PgaTourApiService {
  private gqlClient: GraphQLClient;

  constructor(private readonly httpClient: HttpService) {
    this.gqlClient = new GraphQLClient('https://orchestrator.pgatour.com/graphql', {
      headers: {
        'X-Api-Key': 'da2-gsrx5bibzbb4njvhl7t37wqyl4',
      },
    });
  }

  async getPlayers(onlyActive: boolean): Promise<PgaApiPlayer[]> {
    const query = gql`
      query PlayerDirectory($tourCode: TourCode!, $active: Boolean) {
        playerDirectory(tourCode: $tourCode, active: $active) {
          tourCode
          players {
            id
            isActive
            firstName
            lastName
            shortName
            displayName
            alphaSort
            country
            countryFlag
            headshot
          }
        }
      }
    `;

    const response = await this.gqlClient.request<PgaApiPlayersResponse>(query, {
      tourCode: 'R',
      active: onlyActive,
    });

    return response.playerDirectory.players;
  }

  getTournamentSchedule(): Promise<PgaApiTournamentScheduleResponse> {
    const url = 'https://statdata-api-prod.pgatour.com/api/clientfile/schedule-v2?format=json';
    const response$ = this.httpClient.get<PgaApiTournamentScheduleResponse>(url);
    return lastValueFrom(response$).then((res) => res.data);
  }

  async getTournamentLeaderboard(
    year: string | number,
    tournamentId: string
  ): Promise<PgaApiTournamentLeaderboardResponse> {
    const url = `https://www.pgatour.com/leaderboard`;
    const response$ = this.httpClient.get(url, {
      headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    });

    const res = await lastValueFrom(response$).then((res) => res.data);

    const root = parse(res);

    const embeddedJSScript = root.querySelector('script#__NEXT_DATA__') as HTMLScriptElement | null;
    if (!embeddedJSScript) {
      throw new Error(`Could not find <script id="__NEXT_DATA__"> tag in the DOM`);
    }

    const data = JSON.parse(embeddedJSScript.text)?.props?.pageProps;

    if (!data) {
      throw new Error(`Failed to parse ${year} ${tournamentId} leaderboard data from the DOM`);
    }

    const leaderboard: PgaApiTournamentLeaderboardResponse = {
      leaderboardId: data.leaderboardId,
      leaderboard: data.leaderboard,
    };

    if (leaderboard.leaderboardId !== `R${year}${tournamentId}`) {
      throw new Error(
        `Could not find leaderboard (year=${year}, tournamentId=${tournamentId}). Only found ${leaderboard.leaderboardId}`
      );
    }

    return leaderboard;
  }

  async getProjectedFedexCupPoints(): Promise<PgaApiProjectedFedexCupPointsResponse> {
    const url = `https://statdata.pgatour.com/r/current/projected_points/2671.json`;
    const response$ = this.httpClient.get<PgaApiProjectedFedexCupPointsResponse>(url);
    return lastValueFrom(response$).then((res) => res.data);
  }
}
