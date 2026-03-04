import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerHoleModule } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.module';
import { PgaTournamentPlayerModule } from '../lib/pga-tournament-player.module';

import { PgaTournamentPlayerController } from './pga-tournament-player.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PgaTournamentPlayerModule, PgaTournamentModule, PgaTournamentPlayerHoleModule],
  controllers: [PgaTournamentPlayerController],
})
export class PgaTournamentPlayerApiModule {}
