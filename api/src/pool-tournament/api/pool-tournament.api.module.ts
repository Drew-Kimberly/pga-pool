import { PoolTournamentModule } from '../lib/pool-tournament.module';

import { PoolTournamentController } from './pool-tournament.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PoolTournamentModule],
  controllers: [PoolTournamentController],
})
export class PoolTournmentApiModule {}
