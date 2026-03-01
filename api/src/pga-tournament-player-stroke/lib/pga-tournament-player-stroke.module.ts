import { PgaTourApiModule } from '../../pga-tour-api/lib/v2/pga-tour-api.module';
import { PgaTournamentPlayerHole } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.entity';

import { PgaTournamentPlayerStroke } from './pga-tournament-player-stroke.entity';
import { PgaTournamentPlayerStrokeService } from './pga-tournament-player-stroke.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PgaTournamentPlayerStroke, PgaTournamentPlayerHole]),
    PgaTourApiModule,
  ],
  providers: [PgaTournamentPlayerStrokeService],
  exports: [PgaTournamentPlayerStrokeService],
})
export class PgaTournamentPlayerStrokeModule {}
