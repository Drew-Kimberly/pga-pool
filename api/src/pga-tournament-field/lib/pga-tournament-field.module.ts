import { SeedDataModule } from '../../seed-data/lib/seed-data.module';

import { PgaTournamentFieldService } from './pga-tournament-field.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [SeedDataModule],
  providers: [PgaTournamentFieldService],
  exports: [PgaTournamentFieldService],
})
export class PgaTournamentFieldModule {}
