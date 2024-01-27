import { PgaTournamentPlayer } from '../../../src/pga-tournament-player/lib/pga-tournament-player.entity';
import { PgaTournamentPlayerService } from '../../../src/pga-tournament-player/lib/pga-tournament-player.service';
import { PoolTournamentService } from '../../../src/pool-tournament/lib/pool-tournament.service';
import { PoolTournamentUser } from '../../../src/pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolTournamentUserService } from '../../../src/pool-tournament-user/lib/pool-tournament-user.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';

export async function updatePoolTournamentScores(poolTournamentId: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const db = ctx.get(getDataSourceToken());
  const pgaTourneyPlayerService = ctx.get(PgaTournamentPlayerService);
  const poolTourneyService = ctx.get(PoolTournamentService);
  const poolUserService = ctx.get(PoolTournamentUserService);
  const logger = new Logger(updatePoolTournamentScores.name);

  const poolTournament = await poolTourneyService.get(poolTournamentId);
  if (!poolTournament) {
    throw new Error(`No Pool Tournament found with ID ${poolTournamentId}`);
  }

  await db.transaction('READ COMMITTED', async (txManager) => {
    await pgaTourneyPlayerService.updateScores(
      poolTournament.pga_tournament_id,
      txManager.getRepository(PgaTournamentPlayer)
    );
    logger.log(`Updated player scores for PGA Tournament ${poolTournament.pga_tournament_id}`);

    await poolUserService.updateScores(
      poolTournament.id,
      txManager.getRepository(PoolTournamentUser)
    );
    logger.log(`Updated pool user scores for pool ${poolTournament.id}`);
  });

  await ctx.close();
}
