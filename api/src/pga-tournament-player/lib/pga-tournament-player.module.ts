import { PgaPlayerModule } from '../../pga-player/lib/pga-player.module';
import { PgaTourApiModule } from '../../pga-tour-api/lib/v2/pga-tour-api.module';
import { PgaTournamentModule } from '../../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerHoleModule } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.module';

import { PgaTournamentFieldSyncWorker } from './pga-tournament-field-sync.worker';
import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PgaTournamentPlayerService } from './pga-tournament-player.service';
import { PgaTournamentScoreSyncWorker } from './pga-tournament-score-sync.worker';

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PgaTournamentPlayer]),
    PgaPlayerModule,
    PgaTourApiModule,
    PgaTournamentModule,
    forwardRef(() => PgaTournamentPlayerHoleModule),
  ],
  providers: [
    PgaTournamentPlayerService,
    PgaTournamentFieldSyncWorker,
    PgaTournamentScoreSyncWorker,
  ],
  exports: [PgaTournamentPlayerService],
})
export class PgaTournamentPlayerModule {}
