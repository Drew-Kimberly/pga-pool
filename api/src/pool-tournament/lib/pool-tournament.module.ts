import { PoolTournament } from './pool-tournament.entity';
import { PoolTournamentService } from './pool-tournament.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PoolTournament])],
  providers: [PoolTournamentService],
  exports: [PoolTournamentService],
})
export class PoolTournamentModule {}
