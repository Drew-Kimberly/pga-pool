import { PgaTournamentIngestor } from '../../../src/pga-tournament/lib/pga-tournament.ingest';
import { PgaPoolCliModule } from '../../cli.module';

import { NestFactory } from '@nestjs/core';

export async function ingestTournaments(year: string, tournamentId: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });

  const opts: Parameters<PgaTournamentIngestor['ingest']>[0] = {
    yearOverride: year ? Number(year) : undefined,
    tourneyIdOverride: tournamentId || undefined,
  };

  await ctx.get(PgaTournamentIngestor).ingest(opts);
  await ctx.close();
}
