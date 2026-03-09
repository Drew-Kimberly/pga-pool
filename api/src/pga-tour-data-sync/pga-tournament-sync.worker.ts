import { SYNC_WINDOW_DAYS } from '../async-worker/async-worker.constants';
import { AsyncWorker } from '../async-worker/async-worker.decorator';
import { AsyncWorkerContext, AsyncWorkerHandler } from '../async-worker/async-worker.interface';
import { PgaTournamentIngestor } from '../pga-tournament/lib/pga-tournament.ingest';

import { Logger, LoggerService, Optional } from '@nestjs/common';

@AsyncWorker({ interval: 900 }) // 15 minutes
export class PgaTournamentSyncWorker implements AsyncWorkerHandler {
  constructor(
    private readonly pgaTournamentIngestor: PgaTournamentIngestor,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentSyncWorker.name)
  ) {}

  async run(_context: AsyncWorkerContext): Promise<void> {
    const now = new Date();
    const start = new Date(now.getTime() - SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const years = new Set<number>();
    for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
      years.add(y);
    }

    for (const year of years) {
      await this.pgaTournamentIngestor.ingest({ yearOverride: year });
    }
  }
}
