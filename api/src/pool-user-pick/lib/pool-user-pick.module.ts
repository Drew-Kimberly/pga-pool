import { PoolUserPick } from './pool-user-pick.entity';
import { PoolUserPickService } from './pool-user-pick.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PoolUserPick])],
  providers: [PoolUserPickService],
  exports: [PoolUserPickService],
})
export class PoolUserPickModule {}
