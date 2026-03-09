import { AsyncWorker } from '../../async-worker/async-worker.decorator';
import { AsyncWorkerEventBus } from '../../async-worker/async-worker.event-bus';
import { AsyncWorkerContext, AsyncWorkerHandler } from '../../async-worker/async-worker.interface';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentPlayerHoleService } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.service';

import { PgaTournamentPlayerService } from './pga-tournament-player.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

@AsyncWorker({ interval: 60 * 1000, scope: 'pga_tournament' }) // 1 minute, per-tournament
@Injectable()
export class PgaTournamentScoreSyncWorker implements AsyncWorkerHandler {
  constructor(
    private readonly pgaTournamentPlayerService: PgaTournamentPlayerService,
    private readonly pgaTournamentService: PgaTournamentService,
    private readonly holeService: PgaTournamentPlayerHoleService,
    private readonly eventBus: AsyncWorkerEventBus,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentScoreSyncWorker.name)
  ) {}

  async run(context: AsyncWorkerContext): Promise<void> {
    const { pgaTournament: contextTournament } = context;
    if (!contextTournament) return;

    // Re-fetch tournament to get latest status (context snapshot may be stale)
    const pgaTournament = await this.pgaTournamentService.get(contextTournament.id);
    if (!pgaTournament) return;

    // Update PGA tournament player scores from leaderboard
    await this.pgaTournamentPlayerService.updateScores(pgaTournament.id);

    // Ingest hole-by-hole and stroke data
    await this.holeService.ingestScoringData(pgaTournament);

    // Emit event for pool reactions
    this.eventBus.emit('pga-tournament.scores-updated', {
      pgaTournamentId: pgaTournament.id,
    });

    // Emit completion event if tournament just completed
    if (pgaTournament.tournament_status === PgaTournamentStatus.COMPLETED) {
      this.eventBus.emit('pga-tournament.completed', {
        pgaTournamentId: pgaTournament.id,
      });
    }
  }
}
