import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';
import { PoolTournamentModule } from '../lib/pool-tournament.module';

import { PoolTournamentController } from './pool-tournament.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PoolTournamentModule, PgaTournamentModule],
  controllers: [PoolTournamentController],
})
export class PoolTournamentApiModule {}
