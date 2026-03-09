import { PgaPlayerModule } from '../../pga-player/lib/pga-player.module';
import { PgaTourApiModule } from '../../pga-tour-api/lib/v2/pga-tour-api.module';
import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';

import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PgaTournamentPlayerService } from './pga-tournament-player.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PgaTournamentPlayer]),
    PgaPlayerModule,
    PgaTourApiModule,
    PgaTournamentModule,
  ],
  providers: [PgaTournamentPlayerService],
  exports: [PgaTournamentPlayerService],
})
export class PgaTournamentPlayerModule {}
