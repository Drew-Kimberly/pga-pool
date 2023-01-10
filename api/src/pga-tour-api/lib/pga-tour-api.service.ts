import { lastValueFrom } from 'rxjs';

import { PgaTourApiPlayer, PgaTourApiPlayersResponse } from './pga-tour-api.interface';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PgaTourApiService {
  constructor(private readonly httpClient: HttpService) {}

  getPlayers(): Promise<PgaTourApiPlayer[]> {
    const url = 'https://statdata.pgatour.com/players/player.json';
    const response$ = this.httpClient.get<PgaTourApiPlayersResponse>(url);
    return lastValueFrom(response$).then((res) => res.data.plrs);
  }
}
