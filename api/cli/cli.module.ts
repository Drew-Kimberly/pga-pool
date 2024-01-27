import { RegisteredDatabaseModule } from '../src/database/registered-database.module';
import { LeagueModule } from '../src/league/lib/league.module';
import { LeagueUserModule } from '../src/league-user/lib/league-user.module';
import { MetabetApiModule } from '../src/metabet-api/lib/metabet-api.module';
import { PgaPlayerModule } from '../src/pga-player/lib/pga-player.module';
import { PgaTourApiModule } from '../src/pga-tour-api/lib/v2/pga-tour-api.module';
import { PgaTournamentModule } from '../src/pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerModule } from '../src/pga-tournament-player/lib/pga-tournament-player.module';
import { PoolTournamentModule } from '../src/pool-tournament/lib/pool-tournament.module';
import { PoolTournamentPlayerModule } from '../src/pool-tournament-player/lib/pool-tournament-player.module';
import { PoolTournamentUserModule } from '../src/pool-tournament-user/lib/pool-tournament-user.module';
import { PoolTournamentUserPickModule } from '../src/pool-tournament-user-pick/lib/pool-tournament-user-pick.module';
import { SeedDataModule } from '../src/seed-data/lib/seed-data.module';
import { UserModule } from '../src/user/lib/user.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    RegisteredDatabaseModule,
    SeedDataModule,
    MetabetApiModule,
    PgaTourApiModule,
    PgaPlayerModule,
    PgaTournamentModule,
    PgaTournamentPlayerModule,
    UserModule,
    LeagueModule,
    LeagueUserModule,
    PoolTournamentModule,
    PoolTournamentPlayerModule,
    PoolTournamentUserModule,
    PoolTournamentUserPickModule,
  ],
})
export class PgaPoolCliModule {}
