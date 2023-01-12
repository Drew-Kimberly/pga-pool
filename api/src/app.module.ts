import { RegisteredDatabaseModule } from './database/registered-database.module';
import { HealthApiModule } from './health/api/health.api.module';
import { PoolTournmentApiModule } from './pool-tournament/api/pool-tournament.api.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [RegisteredDatabaseModule, HealthApiModule, PoolTournmentApiModule],
})
export class AppModule {}
