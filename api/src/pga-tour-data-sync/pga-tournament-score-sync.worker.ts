import { AsyncWorker } from '../async-worker/async-worker.decorator';
import { AsyncWorkerContext, AsyncWorkerHandler } from '../async-worker/async-worker.interface';
import { PgaTournamentStatus } from '../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentService } from '../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentPlayerService } from '../pga-tournament-player/lib/pga-tournament-player.service';
import { PgaTournamentPlayerHoleService } from '../pga-tournament-player-hole/lib/pga-tournament-player-hole.service';

import { Logger, LoggerService, Optional } from '@nestjs/common';

@AsyncWorker({ interval: 60, scope: 'pga_tournament' }) // 1 minute, per-tournament
export class PgaTournamentScoreSyncWorker implements AsyncWorkerHandler {
  constructor(
    private readonly pgaTournamentService: PgaTournamentService,
    private readonly pgaTournamentPlayerService: PgaTournamentPlayerService,
    private readonly holeService: PgaTournamentPlayerHoleService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentScoreSyncWorker.name)
  ) {}

  async run(context: AsyncWorkerContext): Promise<void> {
    const { pgaTournament } = context;
    if (!pgaTournament) {
      throw new Error(
        'PgaTournamentScoreSyncWorker requires a pgaTournament context but none was provided'
      );
    }

    const tournament = await this.pgaTournamentService.get(pgaTournament.id);
    if (!tournament || tournament.tournament_status !== PgaTournamentStatus.IN_PROGRESS) {
      return;
    }

    await this.pgaTournamentPlayerService.updateScores(tournament);
    await this.holeService.ingestScoringData(tournament);
  }
}
