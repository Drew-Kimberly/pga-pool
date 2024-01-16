import { TypeOrmListService } from './service';

import { Module } from '@nestjs/common';

@Module({
  providers: [TypeOrmListService],
  exports: [TypeOrmListService],
})
export class ListModule {}
