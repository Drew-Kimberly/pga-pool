import { ListModule } from '../../common/api/list';

import { Pool } from './pool.entity';
import { PoolService } from './pool.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Pool]), ListModule],
  providers: [PoolService],
  exports: [PoolService],
})
export class PoolModule {}
