import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentPlayerHoleService } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.service';
import { PoolTournamentFinalizerService } from '../../pool-tournament/lib/pool-tournament-finalizer.service';
import { PgaPoolCronModule } from '../cron.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

void (async () => {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCronModule, {
    logger: ['log', 'warn', 'error'],
  });
  const pgaTourneyService = ctx.get(PgaTournamentService);
  const poolTournamentFinalizer = ctx.get(PoolTournamentFinalizerService);
  const holeService = ctx.get(PgaTournamentPlayerHoleService);
  const logger = new Logger('tournament-score-updater-cron');

  const pgaTournament = await pgaTourneyService.getCurrent();
  if (!pgaTournament) {
    logger.log('No PGA Tournament is currently underway');
    return await ctx.close();
  }

  logger.log(
    `Updating scores for PGA Tournament ${pgaTournament.year} ${pgaTournament.name} (ID: ${pgaTournament.id})`
  );

  await poolTournamentFinalizer.finalizeForPgaTournament(pgaTournament.id);

  await holeService.ingestScoringData(pgaTournament);

  await ctx.close();
})();
