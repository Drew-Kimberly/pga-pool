import { PgaTournamentPlayerHoleModule } from '../lib/pga-tournament-player-hole.module';

import { PgaTournamentPlayerHoleController } from './pga-tournament-player-hole.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PgaTournamentPlayerHoleModule],
  controllers: [PgaTournamentPlayerHoleController],
})
export class PgaTournamentPlayerHoleApiModule {}
