import { PgaPlayerService } from '../../../src/pga-player/lib/pga-player.service';
import { PgaTourApiService } from '../../../src/pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function ingestPlayers(onlyActive: boolean) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const pgaTourApi = ctx.get(PgaTourApiService);
  const pgaPlayerService = ctx.get(PgaPlayerService);
  const logger = new Logger(ingestPlayers.name);

  const tourPlayers = await pgaTourApi.getPlayers(onlyActive);

  logger.log(`Ingesting ${tourPlayers.length} players`);

  await pgaPlayerService.save(
    tourPlayers.map((p) => ({
      id: p.id,
      active: p.isActive,
      name: p.displayName,
      short_name: p.shortName,
      first_name: p.firstName,
      last_name: p.lastName,
      headshot_url: p.headshot ?? null,
    }))
  );

  await ctx.close();
}
