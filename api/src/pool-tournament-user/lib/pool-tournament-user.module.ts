import { PoolTournamentUser } from './pool-tournament-user.entity';
import { PoolTournamentUserService } from './pool-tournament-user.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PoolTournamentUser])],
  providers: [PoolTournamentUserService],
  exports: [PoolTournamentUserService],
})
export class PoolTournamentUserModule {}
