import { gql, GraphQLClient } from 'graphql-request';
import { parse } from 'node-html-parser';
import { lastValueFrom } from 'rxjs';

import { InjectPgaTourApiConfig, PgaTourApiConfig } from './pga-tour-api.config';
import {
  PgaApiPlayer,
  PgaApiPlayersResponse,
  PgaApiProjectedFedexCupPointsResponse,
  PgaApiTournament,
  PgaApiTournamentLeaderboardResponse,
  PgaApiTournamentSchedule,
  PgaApiTournamentScheduleResponse,
  PgaApiTournamentsResponse,
} from './pga-tour-api.interface';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PgaTourApiService {
  private gqlClient: GraphQLClient;

  constructor(
    private readonly httpClient: HttpService,
    @InjectPgaTourApiConfig()
    private readonly pgaTourApiConfig: PgaTourApiConfig
  ) {
    this.gqlClient = new GraphQLClient(this.pgaTourApiConfig.PGA_TOUR_API_GQL_URL, {
      headers: {
        'X-Api-Key': this.pgaTourApiConfig.PGA_TOUR_API_GQL_API_KEY,
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

  async getTournamentSchedule(year: number): Promise<PgaApiTournamentSchedule> {
    const query = gql`
      query Schedule($tourCode: String!, $year: String, $filter: TournamentCategory) {
        schedule(tourCode: $tourCode, year: $year, filter: $filter) {
          completed {
            month
            year
            monthSort
            ...ScheduleTournament
          }
          filters {
            type
            name
          }
          seasonYear
          tour
          upcoming {
            month
            year
            monthSort
            ...ScheduleTournament
          }
        }
      }

      fragment ScheduleTournament on ScheduleMonth {
        tournaments {
          tournamentName
          id
          beautyImage
          champion
          championEarnings
          championId
          city
          country
          countryCode
          courseName
          date
          dateAccessibilityText
          purse
          startDate
          state
          stateCode
          tournamentLogo
          tourStandingHeading
          tourStandingValue
        }
      }
    `;

    const response = await this.gqlClient.request<PgaApiTournamentScheduleResponse>(query, {
      tourCode: 'R',
      year,
    });

    return response.schedule;
  }

  async getTournaments(tournamentIds: string[]): Promise<PgaApiTournament[]> {
    const query = gql`
      query Tournaments($ids: [ID!]) {
        tournaments(ids: $ids) {
          ...TournamentFragment
        }
      }

      fragment TournamentFragment on Tournament {
        id
        tournamentName
        tournamentLogo
        tournamentLocation
        tournamentStatus
        roundStatusDisplay
        roundDisplay
        roundStatus
        roundStatusColor
        currentRound
        timezone
        seasonYear
        displayDate
        country
        state
        city
        scoredLevel
        infoPath
        events {
          id
          eventName
          leaderboardId
        }
        courses {
          id
          courseName
          courseCode
          hostCourse
          scoringLevel
        }
        weather {
          logo
          logoDark
          logoAccessibility
          tempF
          tempC
          condition
          windDirection
          windSpeedMPH
          windSpeedKPH
          precipitation
          humidity
        }
        formatType
        features
      }
    `;

    const response = await this.gqlClient.request<PgaApiTournamentsResponse>(query, {
      ids: tournamentIds,
    });

    return response.tournaments;
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
