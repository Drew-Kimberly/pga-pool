import { ListModule } from '../../common/api/list';

import { PoolTournament } from './pool-tournament.entity';
import { PoolTournamentService } from './pool-tournament.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PoolTournament]), ListModule],
  providers: [PoolTournamentService],
  exports: [PoolTournamentService],
})
export class PoolTournamentModule {}
