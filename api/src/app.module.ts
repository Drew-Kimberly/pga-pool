import { AuthModule } from './auth/auth.module';
import { RegisteredDatabaseModule } from './database/registered-database.module';
import { ErrorApiModule } from './error/api/error.api.module';
import { HealthApiModule } from './health/api/health.api.module';
import { PgaPlayerApiModule } from './pga-player/api/pga-player-api.module';
import { PgaTournamentApiModule } from './pga-tournament/api/pga-tournament-api.module';
import { PgaTournamentFieldApiModule } from './pga-tournament-field/api/pga-tournament-field.api.module';
import { PgaTournamentPlayerApiModule } from './pga-tournament-player/api/pga-tournament-player.api.module';
import { PgaTournamentPlayerHoleApiModule } from './pga-tournament-player-hole/api/pga-tournament-player-hole.api.module';
import { PoolApiModule } from './pool/api/pool.api.module';
import { PoolTournamentApiModule } from './pool-tournament/api/pool-tournament.api.module';
import { PoolTournamentFieldApiModule } from './pool-tournament-field/api/pool-tournament-field.api.module';
import { PoolTournamentPlayerApiModule } from './pool-tournament-player/api/pool-tournament-player.api.module';
import { PoolTournamentUserApiModule } from './pool-tournament-user/api/pool-tournament-user.api.module';
import { PoolUserApiModule } from './pool-user/api/pool-user.api.module';

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
    PgaTournamentPlayerHoleApiModule,
    PoolApiModule,
    PoolTournamentApiModule,
    PoolTournamentFieldApiModule,
    PoolTournamentPlayerApiModule,
    PoolTournamentUserApiModule,
    PoolUserApiModule,
  ],
})
export class AppModule {}
