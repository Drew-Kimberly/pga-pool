import { AsyncWorker } from '../../async-worker/async-worker.decorator';
import { AsyncWorkerContext, AsyncWorkerHandler } from '../../async-worker/async-worker.interface';
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
    // → PgaTournamentPlayerService.updateScores() emits 'pga-tournament.scores-updated'
    await this.pgaTournamentPlayerService.updateScores(pgaTournament.id);

    // Ingest hole-by-hole and stroke data
    await this.holeService.ingestScoringData(pgaTournament);

    // Tournament completion is detected + emitted by the ingestion service
    // when tournament_status transitions to COMPLETED — not here.
  }
}
