import { ListModule } from '../../common/api/list';

import { PoolTournamentPlayer } from './pool-tournament-player.entity';
import { PoolTournamentPlayerService } from './pool-tournament-player.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PoolTournamentPlayer]), ListModule],
  providers: [PoolTournamentPlayerService],
  exports: [PoolTournamentPlayerService],
})
export class PoolTournamentPlayerModule {}
