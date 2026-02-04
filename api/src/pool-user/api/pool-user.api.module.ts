import { PoolModule } from '../../pool/lib/pool.module';
import { PoolUserModule } from '../lib/pool-user.module';

import { PoolUserController } from './pool-user.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PoolUserModule, PoolModule],
  controllers: [PoolUserController],
})
export class PoolUserApiModule {}
