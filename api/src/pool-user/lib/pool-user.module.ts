import { ListModule } from '../../common/api/list';

import { PoolUser } from './pool-user.entity';
import { PoolUserService } from './pool-user.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PoolUser]), ListModule],
  providers: [PoolUserService],
  exports: [PoolUserService],
})
export class PoolUserModule {}
