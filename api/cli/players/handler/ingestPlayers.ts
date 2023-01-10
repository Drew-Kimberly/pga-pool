import { PgaPlayerService } from '../../../src/pga-player/lib/pga-player.service';
import { PgaTourApiService } from '../../../src/pga-tour-api/lib/pga-tour-api.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

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

  for (const player of filteredTourPlayers) {
    await pgaPlayerService.upsert({
      id: player.pid,
      name: `${player.nameF} ${player.nameL}`,
    });
  }

  await ctx.close();
}
