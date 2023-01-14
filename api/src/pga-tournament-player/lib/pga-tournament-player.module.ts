import { PgaTourApiModule } from '../../pga-tour-api/lib/pga-tour-api.module';
import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';

import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PgaTournamentPlayerService } from './pga-tournament-player.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PgaTournamentPlayer]), PgaTourApiModule, PgaTournamentModule],
  providers: [PgaTournamentPlayerService],
  exports: [PgaTournamentPlayerService],
})
export class PgaTournamentPlayerModule {}
