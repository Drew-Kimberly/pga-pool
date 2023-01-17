import { lastValueFrom } from 'rxjs';

import { InjectMetabetApiConfig, MetabetApiConfig } from './metabet-api.config';
import { playerMap } from './metabet-api.constants';
import {
  GetOddsResponse,
  OddsLocation,
  OddsProvider,
  PgaTournamentOdds,
} from './metabet-api.interface';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MetabetApiService {
  constructor(
    private readonly httpClient: HttpService,
    @InjectMetabetApiConfig()
    private readonly metabetApiConfig: MetabetApiConfig
  ) {}

  async getOdds(
    oddsLocation: OddsLocation = OddsLocation.NewYork,
    oddsProvider: OddsProvider = OddsProvider.Consensus
  ): Promise<PgaTournamentOdds[]> {
    const url = 'https://metabet.static.api.areyouwatchingthis.com/api/sideodds.json';
    const response$ = this.httpClient.get<GetOddsResponse>(url, {
      params: {
        apiKey: this.metabetApiConfig.METABET_API_KEY,
        location: oddsLocation,
        q: 'pga/golf_tournament_stroke_winner',
      },
    });
    const metabetOdds = await lastValueFrom(response$).then((res) => res.data);

    const aggregateOdds: PgaTournamentOdds[] = [];

    const playerIdToPlayerName: Record<number, string> = Object.fromEntries(
      metabetOdds.players.map((p) => [
        p.playerID,
        this.getPlayerName(`${p.firstName} ${p.lastName}`.trim()),
      ])
    );

    const tourneyIdToTourneyName: Record<number, string> = Object.fromEntries(
      metabetOdds.games.map((g) => [g.gameID, g.location.trim()])
    );

    metabetOdds.results.forEach((result) => {
      const odds: PgaTournamentOdds = {
        year: result.season === new Date().getFullYear() ? result.season : result.season + 1,
        metabetTournamentId: result.gameID,
        tournamentName: tourneyIdToTourneyName[result.gameID],
        players: result.sideOdds
          .filter((o) => o.provider === oddsProvider)
          .map((o) => ({
            metabetPlayerId: o.playerID,
            name: playerIdToPlayerName[o.playerID],
            odds: this.calculateAmericanOdds(o.price),
          })),
      };

      aggregateOdds.push(odds);
    });

    return aggregateOdds;
  }

  private calculateAmericanOdds(ratioNumerator: number): number {
    const roundToNearest10 = (val: number) => Math.floor(val / 10) * 10;

    const percentage = 1 / ratioNumerator;
    return roundToNearest10(Math.floor(100 / percentage - 100));
  }

  private getPlayerName(name: string): string {
    return playerMap[name] ? playerMap[name] : name;
  }
}
