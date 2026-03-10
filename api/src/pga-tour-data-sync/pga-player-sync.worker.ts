import { AsyncWorker } from '../async-worker/async-worker.decorator';
import { AsyncWorkerContext, AsyncWorkerHandler } from '../async-worker/async-worker.interface';
import { PgaPlayerIngestor } from '../pga-player/lib/pga-player.ingest';

import { Logger, LoggerService, Optional } from '@nestjs/common';

@AsyncWorker({ interval: 3600 }) // 1 hour
export class PgaPlayerSyncWorker implements AsyncWorkerHandler {
  constructor(
    private readonly pgaPlayerIngestor: PgaPlayerIngestor,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaPlayerSyncWorker.name)
  ) {}

  async run(_context: AsyncWorkerContext): Promise<void> {
    await this.pgaPlayerIngestor.ingest(true);
  }
}
