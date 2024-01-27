import { RegisteredDatabaseModule } from '../database/registered-database.module';
import { PgaTournamentModule } from '../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerModule } from '../pga-tournament-player/lib/pga-tournament-player.module';
import { PoolTournamentModule } from '../pool-tournament/lib/pool-tournament.module';
import { PoolTournamentUserModule } from '../pool-tournament-user/lib/pool-tournament-user.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    RegisteredDatabaseModule,
    PgaTournamentModule,
    PgaTournamentPlayerModule,
    PoolTournamentModule,
    PoolTournamentUserModule,
  ],
})
export class PgaPoolCronModule {}
