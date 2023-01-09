import { HealthApiModule } from './health/api/health.api.module';
import { UserModule } from './user/lib/user.module';
import { DatabaseModule } from './database';

import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule, HealthApiModule, UserModule],
})
export class AppModule {}
