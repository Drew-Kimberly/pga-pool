import { AuthModule } from './auth/auth.module';
import { RegisteredDatabaseModule } from './database/registered-database.module';
import { ErrorApiModule } from './error/api/error.api.module';
import { HealthApiModule } from './health/api/health.api.module';
import { PgaPlayerApiModule } from './pga-player/api/pga-player-api.module';
import { PgaTournamentApiModule } from './pga-tournament/api/pga-tournament-api.module';
import { PgaTournamentFieldApiModule } from './pga-tournament-field/api/pga-tournament-field.api.module';
import { PgaTournamentPlayerApiModule } from './pga-tournament-player/api/pga-tournament-player.api.module';
import { PoolTournamentApiModule } from './pool-tournament/api/pool-tournament.api.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    RegisteredDatabaseModule,
    AuthModule,
    ErrorApiModule,
    HealthApiModule,
    PgaPlayerApiModule,
    PgaTournamentApiModule,
    PgaTournamentFieldApiModule,
    PgaTournamentPlayerApiModule,
    PoolTournamentApiModule,
  ],
})
export class AppModule {}
