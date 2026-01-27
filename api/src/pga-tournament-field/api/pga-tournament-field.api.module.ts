import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentFieldModule } from '../lib/pga-tournament-field.module';

import { PgaTournamentFieldController } from './pga-tournament-field.controller';
import { WeeklyPgaTournamentFieldController } from './weekly-pga-tournament-field.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PgaTournamentFieldModule, PgaTournamentModule],
  // Note: WeeklyPgaTournamentFieldController must be listed BEFORE PgaTournamentFieldController
  // to ensure /pga-tournaments/weekly-field is matched before /pga-tournaments/:pgaTournamentId/field
  controllers: [WeeklyPgaTournamentFieldController, PgaTournamentFieldController],
})
export class PgaTournamentFieldApiModule {}
