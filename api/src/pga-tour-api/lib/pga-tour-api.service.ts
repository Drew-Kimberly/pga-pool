import { lastValueFrom } from 'rxjs';

import {
  PgaApiPlayer,
  PgaApiPlayersResponse,
  PgaApiTournamentScheduleResponse,
} from './pga-tour-api.interface';
import { UserTrackingIdFactory } from './user-tracking-id-factory.service';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PgaTourApiService {
  constructor(
    private readonly httpClient: HttpService,
    private readonly userTrackingIdFactory: UserTrackingIdFactory
  ) {}

  getPlayers(): Promise<PgaApiPlayer[]> {
    const url = 'https://statdata.pgatour.com/players/player.json';
    const response$ = this.httpClient.get<PgaApiPlayersResponse>(url);
    return lastValueFrom(response$).then((res) => res.data.plrs);
  }

  getTournamentSchedule(): Promise<PgaApiTournamentScheduleResponse> {
    const url = 'https://statdata-api-prod.pgatour.com/api/clientfile/schedule-v2?format=json';
    const response$ = this.httpClient.get<PgaApiTournamentScheduleResponse>(url);
    return lastValueFrom(response$).then((res) => res.data);
  }

  async getTournamentLeaderboard(year: string | number, tournamentId: string) {
    const url = `https://lbdata.pgatour.com/${year}/r/${tournamentId}/leaderboard.json`;
    const params = await this.userTrackingIdFactory.create();
    const response$ = this.httpClient.get(url, { params });
    return lastValueFrom(response$).then((res) => res.data);
  }
}
