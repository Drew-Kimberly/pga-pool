import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentFieldModule } from '../lib/pga-tournament-field.module';

import { PgaTournamentFieldController } from './pga-tournament-field.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PgaTournamentFieldModule, PgaTournamentModule],
  controllers: [PgaTournamentFieldController],
})
export class PgaTournamentFieldApiModule {}
