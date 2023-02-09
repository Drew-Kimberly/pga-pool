import { PgaPlayerService } from '../../../src/pga-player/lib/pga-player.service';
import { PgaTourApiService } from '../../../src/pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const BATCH_SIZE = 25;

export async function ingestPlayers(fromYear: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule);
  const pgaTourApi = ctx.get(PgaTourApiService);
  const pgaPlayerService = ctx.get(PgaPlayerService);
  const logger = new Logger(ingestPlayers.name);

  const tourPlayers = await pgaTourApi.getPlayers();

  const filteredTourPlayers = tourPlayers.filter((player) =>
    player.yrs.some((y) => Number(y) >= Number(fromYear))
  );

  logger.log(
    `Ingesting ${filteredTourPlayers.length} of ${tourPlayers.length} players filtered on played since year ${fromYear}`
  );

  // @note - idempotent operation here so not worried about a DB tx
  for (let i = 0; i < filteredTourPlayers.length; i += BATCH_SIZE) {
    const batch = filteredTourPlayers.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map((player) =>
        pgaPlayerService.upsert({
          id: player.pid,
          name: `${player.nameF} ${player.nameL}`,
        })
      )
    );
  }

  await ctx.close();
}
