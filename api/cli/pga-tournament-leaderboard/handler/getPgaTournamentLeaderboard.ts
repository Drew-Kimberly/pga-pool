import { PgaTourApiService } from '../../../src/pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentService } from '../../../src/pga-tournament/lib/pga-tournament.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';
import { DEFAULT_TOURNAMENT_ID } from '../constants';

import { NestFactory } from '@nestjs/core';

export async function getPgaTournamentLeaderboard(tournamentId: string, year: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const pgaTourApi = ctx.get(PgaTourApiService);
  const pgaTournamentService = ctx.get(PgaTournamentService);

  if (tournamentId === DEFAULT_TOURNAMENT_ID) {
    const currentTournament = await pgaTournamentService.getCurrent();
    if (!currentTournament) {
      throw new Error(`There is no active tournament! (Year: ${year})`);
    }

    tournamentId = currentTournament.tournament_id;
  }

  const leaderboard = await pgaTourApi.getTournamentLeaderboard(year, tournamentId);

  outputJson(leaderboard);

  await ctx.close();
}
