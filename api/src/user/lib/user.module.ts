import { SeedDataModule } from 'src/seed-data/lib/seed-data.module';

import { UserService } from './user.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [SeedDataModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
