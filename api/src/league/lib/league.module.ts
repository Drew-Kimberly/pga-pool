import { ListModule } from '../../common/api/list';

import { League } from './league.entity';
import { LeagueService } from './league.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([League]), ListModule],
  providers: [LeagueService],
  exports: [LeagueService],
})
export class LeagueModule {}
