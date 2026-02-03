import { RegisteredDatabaseModule } from '../database/registered-database.module';
import { PgaPlayerModule } from '../pga-player/lib/pga-player.module';
import { PgaTournamentModule } from '../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerModule } from '../pga-tournament-player/lib/pga-tournament-player.module';
import { PoolTournamentModule } from '../pool-tournament/lib/pool-tournament.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    RegisteredDatabaseModule,
    PgaPlayerModule,
    PgaTournamentModule,
    PgaTournamentPlayerModule,
    PoolTournamentModule,
  ],
})
export class PgaPoolAsyncWorkerModule {}
