import { PgaTournamentFieldModule } from '../lib/pga-tournament-field.module';

import { PgaTournamentFieldController } from './pga-tournament-field.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PgaTournamentFieldModule],
  controllers: [PgaTournamentFieldController],
})
export class PgaTournamentFieldApiModule {}
