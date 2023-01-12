import { RegisteredDatabaseModule } from '../src/database/registered-database.module';
import { PgaPlayerModule } from '../src/pga-player/lib/pga-player.module';
import { PgaTourApiModule } from '../src/pga-tour-api/lib/pga-tour-api.module';
import { PgaTournamentModule } from '../src/pga-tournament/lib/pga-tournament.module';
import { SeedDataModule } from '../src/seed-data/lib/seed-data.module';
import { UserModule } from '../src/user/lib/user.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    RegisteredDatabaseModule,
    SeedDataModule,
    PgaPlayerModule,
    PgaTournamentModule,
    PgaTourApiModule,
    UserModule,
  ],
})
export class PgaPoolCliModule {}
