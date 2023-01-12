import { PgaPlayerModule } from '../../pga-player/lib/pga-player.module';
import { PgaTourApiModule } from '../../pga-tour-api/lib/pga-tour-api.module';
import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';
import { SeedDataModule } from '../../seed-data/lib/seed-data.module';

import { PoolTournamentService } from './pool-tournament.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [SeedDataModule, PgaTourApiModule, PgaPlayerModule, PgaTournamentModule],
  providers: [PoolTournamentService],
  exports: [PoolTournamentService],
})
export class PoolTournmentModule {}
