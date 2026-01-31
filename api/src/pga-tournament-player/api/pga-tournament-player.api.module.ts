import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerModule } from '../lib/pga-tournament-player.module';

import { PgaTournamentPlayerController } from './pga-tournament-player.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PgaTournamentPlayerModule, PgaTournamentModule],
  controllers: [PgaTournamentPlayerController],
})
export class PgaTournamentPlayerApiModule {}
