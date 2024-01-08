import { PgaTournamentModule } from '../lib/pga-tournament.module';

import { PgaTournamentController } from './pga-tournament-controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PgaTournamentModule],
  controllers: [PgaTournamentController],
})
export class PgaTournamentApiModule {}
