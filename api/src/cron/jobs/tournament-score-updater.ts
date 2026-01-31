import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';
import { PgaTournamentPlayerService } from '../../pga-tournament-player/lib/pga-tournament-player.service';
import { PoolTournamentService } from '../../pool-tournament/lib/pool-tournament.service';
import { PoolTournamentUserService } from '../../pool-tournament-user/lib/pool-tournament-user.service';
import { PgaPoolCronModule } from '../cron.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';

void (async () => {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCronModule, {
    logger: ['log', 'warn', 'error'],
  });
  const db = ctx.get(getDataSourceToken());
  const pgaTourneyService = ctx.get(PgaTournamentService);
  const pgaTourneyPlayerService = ctx.get(PgaTournamentPlayerService);
  const poolTourneyService = ctx.get(PoolTournamentService);
  const poolUserService = ctx.get(PoolTournamentUserService);
  const logger = new Logger('tournament-score-updater-cron');

  const pgaTournament = await pgaTourneyService.getCurrent();
  if (!pgaTournament) {
    logger.log('No PGA Tournament is currently underway');
    return await ctx.close();
  }

  logger.log(
    `Updating scores for PGA Tournament ${pgaTournament.year} ${pgaTournament.name} (ID: ${pgaTournament.id})`
  );

  await db.transaction('READ COMMITTED', async (txManager) => {
    await pgaTourneyPlayerService.updateScores(
      pgaTournament.id,
      txManager.getRepository(PgaTournamentPlayer)
    );
    logger.log(`Updated player scores for PGA Tournament ${pgaTournament.id}`);

    // TODO - need to provide correct Pool ID.
    // const poolTournaments = await poolTourneyService.list(randomUUID(), {
    //   page: { number: 0, size: 100 },
    //   filter: { 'pga_tournament.id': pgaTournament.id },
    // });

    // for (const poolTournament of poolTournaments.data) {
    //   await poolUserService.updateScores(
    //     poolTournament.id,
    //     txManager.getRepository(PoolTournamentUser)
    //   );
    //   logger.log(`Updated pool user scores for pool ${poolTournament.id}`);
    // }
  });

  await ctx.close();
})();
