import { PoolTournamentUserPick } from './pool-tournament-user-pick.entity';
import { PoolTournamentUserPickService } from './pool-tournament-user-pick.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PoolTournamentUserPick])],
  providers: [PoolTournamentUserPickService],
  exports: [PoolTournamentUserPickService],
})
export class PoolTournamentUserPickModule {}
