import { PgaPlayerIngestor } from '../../../src/pga-player/lib/pga-player.ingest';
import { PgaPoolCliModule } from '../../cli.module';

import { NestFactory } from '@nestjs/core';

export async function ingestPlayers(includeInactive: boolean) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });

  await ctx.get(PgaPlayerIngestor).ingest(includeInactive);
  await ctx.close();
}
