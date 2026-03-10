import { PgaPlayerModule } from '../pga-player/lib/pga-player.module';
import { PgaTournamentModule } from '../pga-tournament/lib/pga-tournament.module';
import { PgaTournamentPlayerModule } from '../pga-tournament-player/lib/pga-tournament-player.module';
import { PgaTournamentPlayerHoleModule } from '../pga-tournament-player-hole/lib/pga-tournament-player-hole.module';

import { PgaPlayerSyncWorker } from './pga-player-sync.worker';
import { PgaTournamentFieldSyncWorker } from './pga-tournament-field-sync.worker';
import { PgaTournamentScoreSyncWorker } from './pga-tournament-score-sync.worker';
import { PgaTournamentSyncWorker } from './pga-tournament-sync.worker';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    PgaPlayerModule,
    PgaTournamentModule,
    PgaTournamentPlayerModule,
    PgaTournamentPlayerHoleModule,
  ],
  providers: [
    PgaPlayerSyncWorker,
    PgaTournamentSyncWorker,
    PgaTournamentFieldSyncWorker,
    PgaTournamentScoreSyncWorker,
  ],
})
export class PgaTourDataSyncModule {}
