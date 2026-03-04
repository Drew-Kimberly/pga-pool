import { PgaTournamentPlayerHoleModule } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.module';
import { PoolTournamentModule } from '../../pool-tournament/lib/pool-tournament.module';
import { PoolTournamentUserModule } from '../lib/pool-tournament-user.module';

import { PoolTournamentUserController } from './pool-tournament-user.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PoolTournamentModule, PoolTournamentUserModule, PgaTournamentPlayerHoleModule],
  controllers: [PoolTournamentUserController],
})
export class PoolTournamentUserApiModule {}
