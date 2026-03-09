import { AsyncWorker } from '../async-worker/async-worker.decorator';
import { AsyncWorkerContext, AsyncWorkerHandler } from '../async-worker/async-worker.interface';
import { PgaTournamentPlayerService } from '../pga-tournament-player/lib/pga-tournament-player.service';

import { Logger, LoggerService, Optional } from '@nestjs/common';

@AsyncWorker({ interval: 900, scope: 'pga_tournament' }) // 15 minutes, per-tournament
export class PgaTournamentFieldSyncWorker implements AsyncWorkerHandler {
  constructor(
    private readonly pgaTournamentPlayerService: PgaTournamentPlayerService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentFieldSyncWorker.name)
  ) {}

  async run(context: AsyncWorkerContext): Promise<void> {
    const { pgaTournament } = context;
    if (!pgaTournament) {
      throw new Error(
        'PgaTournamentFieldSyncWorker requires a pgaTournament context but none was provided'
      );
    }

    await this.pgaTournamentPlayerService.upsertFieldForTournament(pgaTournament.id);
  }
}
