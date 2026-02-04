import { PoolTournamentModule } from '../../pool-tournament/lib/pool-tournament.module';
import { PoolTournamentPlayerModule } from '../lib/pool-tournament-player.module';

import { PoolTournamentPlayerController } from './pool-tournament-player.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PoolTournamentModule, PoolTournamentPlayerModule],
  controllers: [PoolTournamentPlayerController],
})
export class PoolTournamentPlayerApiModule {}
