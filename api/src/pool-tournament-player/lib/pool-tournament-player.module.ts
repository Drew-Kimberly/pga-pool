import { PoolTournamentPlayer } from './pool-tournament-player.entity';
import { PoolTournamentPlayerService } from './pool-tournament-player.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PoolTournamentPlayer])],
  providers: [PoolTournamentPlayerService],
  exports: [PoolTournamentPlayerService],
})
export class PoolTournamentPlayerModule {}
