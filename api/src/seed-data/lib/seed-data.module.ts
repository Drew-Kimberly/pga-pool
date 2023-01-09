import { SeedDataService } from './seed-data.service';

import { Module } from '@nestjs/common';

@Module({
  providers: [SeedDataService],
  exports: [SeedDataService],
})
export class SeedDataModule {}
