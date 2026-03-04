import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerHoleModule } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.module';
import { PoolTournamentModule } from '../../pool-tournament/lib/pool-tournament.module';
import { PoolTournamentPlayerModule } from '../../pool-tournament-player/lib/pool-tournament-player.module';

import { PoolTournamentFieldController } from './pool-tournament-field.controller';
import { WeeklyPoolTournamentFieldController } from './weekly-pool-tournament-field.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    PgaTournamentModule,
    PgaTournamentPlayerHoleModule,
    PoolTournamentModule,
    PoolTournamentPlayerModule,
  ],
  controllers: [PoolTournamentFieldController, WeeklyPoolTournamentFieldController],
})
export class PoolTournamentFieldApiModule {}
