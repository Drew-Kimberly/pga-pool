import { RegisteredDatabaseModule } from '../src/database/registered-database.module';
import { PgaPlayerModule } from '../src/pga-player/lib/pga-player.module';
import { PgaTourApiModule } from '../src/pga-tour-api/lib/pga-tour-api.module';
import { PgaTournamentModule } from '../src/pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerModule } from '../src/pga-tournament-player/lib/pga-tournament-player.module';
import { PoolTournamentModule } from '../src/pool-tournament/lib/pool-tournament.module';
import { PoolTournamentPlayerModule } from '../src/pool-tournament-player/lib/pool-tournament-player.module';
import { PoolUserModule } from '../src/pool-user/lib/pool-user.module';
import { PoolUserPickModule } from '../src/pool-user-pick/lib/pool-user-pick.module';
import { SeedDataModule } from '../src/seed-data/lib/seed-data.module';
import { UserModule } from '../src/user/lib/user.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    RegisteredDatabaseModule,
    SeedDataModule,
    PgaTourApiModule,
    PgaPlayerModule,
    PgaTournamentModule,
    PgaTournamentPlayerModule,
    UserModule,
    PoolTournamentModule,
    PoolTournamentPlayerModule,
    PoolUserModule,
    PoolUserPickModule,
  ],
})
export class PgaPoolCliModule {}
