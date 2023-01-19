import { RegisteredDatabaseModule } from './database/registered-database.module';
import { ErrorApiModule } from './error/api/error.api.module';
import { HealthApiModule } from './health/api/health.api.module';
import { PgaTournamentFieldApiModule } from './pga-tournament-field/api/pga-tournament-field.api.module';
import { PoolTournamentApiModule } from './pool-tournament/api/pool-tournament.api.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    RegisteredDatabaseModule,
    ErrorApiModule,
    HealthApiModule,
    PoolTournamentApiModule,
    PgaTournamentFieldApiModule,
  ],
})
export class AppModule {}
