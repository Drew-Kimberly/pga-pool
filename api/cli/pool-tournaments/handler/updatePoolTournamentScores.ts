import { PoolTournamentFinalizerService } from '../../../src/pool-tournament/lib/pool-tournament-finalizer.service';
import { PgaPoolCliModule } from '../../cli.module';

import { NestFactory } from '@nestjs/core';

export async function updatePoolTournamentScores(poolTournamentId: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const finalizer = ctx.get(PoolTournamentFinalizerService);
  await finalizer.finalizePoolTournament(poolTournamentId);

  await ctx.close();
}
