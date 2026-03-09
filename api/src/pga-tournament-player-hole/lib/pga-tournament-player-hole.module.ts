import { PgaTourApiModule } from '../../pga-tour-api/lib/v2/pga-tour-api.module';
import { PgaTournamentPlayerModule } from '../../pga-tournament-player/lib/pga-tournament-player.module';
import { PgaTournamentPlayerStrokeModule } from '../../pga-tournament-player-stroke/lib/pga-tournament-player-stroke.module';

import { PgaTournamentPlayerHole } from './pga-tournament-player-hole.entity';
import { PgaTournamentPlayerHoleService } from './pga-tournament-player-hole.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PgaTournamentPlayerHole]),
    PgaTourApiModule,
    PgaTournamentPlayerModule,
    PgaTournamentPlayerStrokeModule,
  ],
  providers: [PgaTournamentPlayerHoleService],
  exports: [PgaTournamentPlayerHoleService],
})
export class PgaTournamentPlayerHoleModule {}
