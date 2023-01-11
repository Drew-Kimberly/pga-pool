import { DatabaseModule } from '../src/database';
import { PgaPlayer } from '../src/pga-player/lib/pga-player.entity';
import { PgaPlayerModule } from '../src/pga-player/lib/pga-player.module';
import { PgaTourApiModule } from '../src/pga-tour-api/lib/pga-tour-api.module';
import { PgaTournament } from '../src/pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentModule } from '../src/pga-tournament/lib/pga-tournament.module';
import { SeedDataModule } from '../src/seed-data/lib/seed-data.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseModule.register([PgaPlayer, PgaTournament]),
    SeedDataModule,
    PgaPlayerModule,
    PgaTournamentModule,
    PgaTourApiModule,
  ],
})
export class PgaPoolCliModule {}
