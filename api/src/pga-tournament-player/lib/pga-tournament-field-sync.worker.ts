import { AsyncWorker } from '../../async-worker/async-worker.decorator';
import { AsyncWorkerContext, AsyncWorkerHandler } from '../../async-worker/async-worker.interface';

import { PgaTournamentPlayerService } from './pga-tournament-player.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

@AsyncWorker({ interval: 15 * 60 * 1000, scope: 'pga_tournament' }) // 15 minutes, per-tournament
@Injectable()
export class PgaTournamentFieldSyncWorker implements AsyncWorkerHandler {
  constructor(
    private readonly pgaTournamentPlayerService: PgaTournamentPlayerService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentFieldSyncWorker.name)
  ) {}

  async run(context: AsyncWorkerContext): Promise<void> {
    const { pgaTournament } = context;
    if (!pgaTournament) return;

    await this.pgaTournamentPlayerService.upsertFieldForTournament(pgaTournament.id);
  }
}
