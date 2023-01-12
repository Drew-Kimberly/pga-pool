import { PoolTournmentModule } from '../lib/pool-tournament.module';

import { PoolTournamentController } from './pool-tournament.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PoolTournmentModule],
  controllers: [PoolTournamentController],
})
export class PoolTournmentApiModule {}
