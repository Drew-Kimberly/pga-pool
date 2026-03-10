import { ListModule } from '../../common/api/list';
import { PgaTournamentPlayerModule } from '../../pga-tournament-player/lib/pga-tournament-player.module';
import { PoolTournamentUserModule } from '../../pool-tournament-user/lib/pool-tournament-user.module';

import { PoolFinalizationReactionHandler } from './pool-finalization-reaction.handler';
import { PoolScoreReactionHandler } from './pool-score-reaction.handler';
import { PoolTournament } from './pool-tournament.entity';
import { PoolTournamentService } from './pool-tournament.service';
import { PoolTournamentFinalizerService } from './pool-tournament-finalizer.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PoolTournament]),
    ListModule,
    PgaTournamentPlayerModule,
    PoolTournamentUserModule,
  ],
  providers: [
    PoolTournamentService,
    PoolTournamentFinalizerService,
    PoolScoreReactionHandler,
    PoolFinalizationReactionHandler,
  ],
  exports: [PoolTournamentService, PoolTournamentFinalizerService],
})
export class PoolTournamentModule {}
