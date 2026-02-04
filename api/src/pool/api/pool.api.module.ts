import { PoolModule } from '../lib/pool.module';

import { PoolController } from './pool.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PoolModule],
  controllers: [PoolController],
})
export class PoolApiModule {}
