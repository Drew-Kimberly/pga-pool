import { PgaTournamentFieldModule } from '../../pga-tournament-field/lib/pga-tournament-field.module';
import { PoolTournamentModule } from '../../pool-tournament/lib/pool-tournament.module';
import { PoolTournamentPlayerModule } from '../../pool-tournament-player/lib/pool-tournament-player.module';

import { PoolTournamentFieldController } from './pool-tournament-field.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PoolTournamentModule, PoolTournamentPlayerModule, PgaTournamentFieldModule],
  controllers: [PoolTournamentFieldController],
})
export class PoolTournamentFieldApiModule {}
