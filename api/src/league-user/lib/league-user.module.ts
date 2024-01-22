import { ListModule } from '../../common/api/list';

import { LeagueUser } from './league-user.entity';
import { LeagueUserService } from './league-user.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LeagueUser]), ListModule],
  providers: [LeagueUserService],
  exports: [LeagueUserService],
})
export class LeagueUserModule {}
