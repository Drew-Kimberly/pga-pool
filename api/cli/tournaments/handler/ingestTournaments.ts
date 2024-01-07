import { PgaTournamentIngestor } from '../../../src/pga-tournament/lib/pga-tournament.ingest';
import { PgaPoolCliModule } from '../../cli.module';

import { NestFactory } from '@nestjs/core';

export async function ingestTournaments(year: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  await ctx.get(PgaTournamentIngestor).ingest(year ? Number(year) : undefined);
  await ctx.close();
}
