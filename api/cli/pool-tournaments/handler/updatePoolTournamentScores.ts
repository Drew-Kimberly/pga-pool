import { PgaTournamentService } from '../../../src/pga-tournament/lib/pga-tournament.service';
import { PgaTournamentPlayer } from '../../../src/pga-tournament-player/lib/pga-tournament-player.entity';
import { PgaTournamentPlayerService } from '../../../src/pga-tournament-player/lib/pga-tournament-player.service';
import { PoolTournament } from '../../../src/pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentService } from '../../../src/pool-tournament/lib/pool-tournament.service';
import { PoolUser } from '../../../src/pool-user/lib/pool-user.entity';
import { PoolUserService } from '../../../src/pool-user/lib/pool-user.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';

export async function updatePoolTournamentScores(pgaTournamentId: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const db = ctx.get(getDataSourceToken());
  const pgaTourneyService = ctx.get(PgaTournamentService);
  const pgaTourneyPlayerService = ctx.get(PgaTournamentPlayerService);
  const poolTourneyService = ctx.get(PoolTournamentService);
  const poolUserService = ctx.get(PoolUserService);
  const logger = new Logger(updatePoolTournamentScores.name);

  const pgaTournament = await pgaTourneyService.get(pgaTournamentId);
  if (!pgaTournament) {
    throw new Error(`No PGA Tournament found with ID ${pgaTournamentId}`);
  }

  await db.transaction('READ COMMITTED', async (txManager) => {
    await pgaTourneyPlayerService.updateScores(
      pgaTournamentId,
      txManager.getRepository(PgaTournamentPlayer)
    );
    logger.log(`Updated player scores for PGA Tournament ${pgaTournamentId}`);

    const poolTournaments = await poolTourneyService.list(
      { pgaTournamentId },
      txManager.getRepository(PoolTournament)
    );

    for (const poolTournament of poolTournaments) {
      await poolUserService.updateScores(poolTournament.id, txManager.getRepository(PoolUser));
      logger.log(`Updated pool user scores for pool ${poolTournament.id}`);
    }
  });

  await ctx.close();
}
