import { PgaPlayerIngestor } from '../pga-player/lib/pga-player.ingest';
import { PgaTournamentIngestor } from '../pga-tournament/lib/pga-tournament.ingest';
import { PgaTournamentService } from '../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentPlayerService } from '../pga-tournament-player/lib/pga-tournament-player.service';
import { PoolTournamentFinalizerService } from '../pool-tournament/lib/pool-tournament-finalizer.service';

import { PgaPoolAsyncWorkerModule } from './async-worker.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const MS_IN_HOUR = 60 * 60 * 1000;
const DEFAULT_JITTER_MS = 10 * 60 * 1000;
const JITTER_MS = Number(process.env.ASYNC_WORKER_JITTER_MS ?? DEFAULT_JITTER_MS);
const WINDOW_DAYS = 14;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const jitterMs = () => Math.round((Math.random() * 2 - 1) * JITTER_MS);

const uniqueYearsInRange = (start: Date, end: Date) => {
  const years = new Set<number>();
  for (let y = start.getFullYear(); y <= end.getFullYear(); y += 1) {
    years.add(y);
  }
  return [...years];
};

const computeWindow = () => {
  const now = new Date();
  const start = new Date(now.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const end = new Date(now.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000);
  return { start, end };
};

void (async () => {
  const ctx = await NestFactory.createApplicationContext(PgaPoolAsyncWorkerModule, {
    logger: ['log', 'warn', 'error'],
  });
  const logger = new Logger('async-worker');
  const pgaTournamentService = ctx.get(PgaTournamentService);
  const pgaTournamentPlayerService = ctx.get(PgaTournamentPlayerService);
  const pgaTournamentIngestor = ctx.get(PgaTournamentIngestor);
  const pgaPlayerIngestor = ctx.get(PgaPlayerIngestor);
  const poolTournamentFinalizer = ctx.get(PoolTournamentFinalizerService);

  const runOnce = async () => {
    const { start, end } = computeWindow();
    logger.log(`Running field sync window ${start.toISOString()} -> ${end.toISOString()}`);

    const years = uniqueYearsInRange(start, end);
    for (const year of years) {
      await pgaTournamentIngestor.ingest({ yearOverride: year });
    }

    await pgaPlayerIngestor.ingest(true);

    const tournaments = await pgaTournamentService.listByDateRange(start, end);
    for (const tournament of tournaments) {
      try {
        await pgaTournamentPlayerService.upsertFieldForTournament(tournament.id);
        await poolTournamentFinalizer.finalizeForPgaTournament(tournament.id);
      } catch (e) {
        logger.error(`Error syncing field for PGA Tournament ${tournament.id}: ${e}`, e.stack);
      }
    }
  };

  while (true) {
    const delay = Math.max(0, jitterMs());
    if (delay > 0) {
      logger.log(`Scheduling next run in ${Math.round(delay / 1000)}s (jitter)`);
      await sleep(delay);
    }

    try {
      await runOnce();
    } catch (e) {
      logger.error(`Async worker run failed: ${e}`, e.stack);
    }

    const nextDelay = MS_IN_HOUR + jitterMs();
    const normalizedDelay = Math.max(0, nextDelay);
    logger.log(`Next run scheduled in ${Math.round(normalizedDelay / 1000 / 60)}m`);
    await sleep(normalizedDelay);
  }
})();
