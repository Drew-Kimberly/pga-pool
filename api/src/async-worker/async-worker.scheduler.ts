import { PgaTournament } from '../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentService } from '../pga-tournament/lib/pga-tournament.service';

import {
  ASYNC_WORKERS_ENABLED_ENV,
  SYNC_WINDOW_DAYS,
  WINDOW_REFRESH_INTERVAL_MS,
} from './async-worker.constants';
import { AsyncWorkerContext } from './async-worker.interface';
import { AsyncWorkerRegistry, RegisteredWorker } from './async-worker.registry';

import {
  Injectable,
  Logger,
  LoggerService,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  Optional,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ScheduledInstance {
  timer: ReturnType<typeof setTimeout> | null;
  running: boolean;
  aborted: boolean;
  runPromise: Promise<void> | null;
}

@Injectable()
export class AsyncWorkerScheduler implements OnApplicationBootstrap, OnApplicationShutdown {
  /** Map of instance key → scheduled state. Key format: "global:{name}" or "tournament:{name}:{tournamentId}" */
  private readonly instances = new Map<string, ScheduledInstance>();
  private windowRefreshTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly registry: AsyncWorkerRegistry,
    private readonly pgaTournamentService: PgaTournamentService,
    private readonly configService: ConfigService,
    @Optional()
    private readonly logger: LoggerService = new Logger(AsyncWorkerScheduler.name)
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (!this.isEnabled()) {
      this.logger.log('Async workers disabled via ASYNC_WORKERS_ENABLED=false');
      return;
    }

    const workers = this.registry.getWorkers();
    this.logger.log(`Discovered ${workers.size} async worker(s)`);

    const allWorkers = [...workers.values()];

    // Start global workers
    for (const worker of allWorkers.filter((w) => w.options.scope === 'global')) {
      this.startGlobalWorker(worker);
    }

    // Start per-tournament workers
    const tournamentWorkers = allWorkers.filter((w) => w.options.scope === 'pga_tournament');
    if (tournamentWorkers.length > 0) {
      await this.refreshTournamentWindow(tournamentWorkers);
      this.scheduleWindowRefresh(tournamentWorkers);
    }
  }

  async onApplicationShutdown(): Promise<void> {
    this.logger.log('Shutting down async workers...');

    // Clear window refresh timer
    if (this.windowRefreshTimer) {
      clearTimeout(this.windowRefreshTimer);
      this.windowRefreshTimer = null;
    }

    // Mark all instances as aborted and clear their timers
    const runningPromises: Promise<void>[] = [];
    for (const [, instance] of this.instances) {
      instance.aborted = true;
      if (instance.timer) {
        clearTimeout(instance.timer);
        instance.timer = null;
      }
      if (instance.runPromise) {
        runningPromises.push(instance.runPromise);
      }
    }

    // Wait for currently-running workers to finish
    if (runningPromises.length > 0) {
      this.logger.log(`Waiting for ${runningPromises.length} running worker(s) to complete...`);
      await Promise.allSettled(runningPromises);
    }

    this.instances.clear();
    this.logger.log('All async workers stopped');
  }

  // --- Global Workers ---

  private startGlobalWorker(worker: RegisteredWorker): void {
    const key = `global:${worker.name}`;
    const instance = this.createInstance(key);
    this.scheduleInitialRun(key, instance, worker, {});
    this.logger.log(
      `Scheduled global worker "${worker.name}" — interval ${this.formatMs(this.intervalMs(worker))}`
    );
  }

  // --- Tournament Window Management ---

  private async refreshTournamentWindow(tournamentWorkers: RegisteredWorker[]): Promise<void> {
    const now = new Date();
    const start = new Date(now.getTime() - SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + SYNC_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const tournaments = await this.pgaTournamentService.listByDateRange(start, end);
    const currentTournamentIds = new Set(tournaments.map((t: PgaTournament) => t.id));

    this.logger.log(
      `Tournament sync window: ${start.toISOString().split('T')[0]} → ${end.toISOString().split('T')[0]} (${tournaments.length} tournament(s))`
    );

    // Spawn workers for new tournaments
    for (const tournament of tournaments) {
      for (const worker of tournamentWorkers) {
        const key = `tournament:${worker.name}:${tournament.id}`;
        if (!this.instances.has(key)) {
          const instance = this.createInstance(key);
          this.scheduleInitialRun(key, instance, worker, { pgaTournament: tournament });
          this.logger.log(
            `Spawned tournament worker "${worker.name}" for ${tournament.name} (${tournament.id})`
          );
        }
      }
    }

    // Tear down workers for tournaments no longer in window
    for (const [key, instance] of this.instances) {
      if (!key.startsWith('tournament:')) continue;
      const tournamentId = key.split(':').slice(2).join(':');
      if (!currentTournamentIds.has(tournamentId)) {
        instance.aborted = true;
        if (instance.timer) {
          clearTimeout(instance.timer);
          instance.timer = null;
        }
        this.instances.delete(key);
        this.logger.log(`Tore down tournament worker instance ${key}`);
      }
    }
  }

  private scheduleWindowRefresh(tournamentWorkers: RegisteredWorker[]): void {
    this.windowRefreshTimer = setTimeout(async () => {
      try {
        await this.refreshTournamentWindow(tournamentWorkers);
      } catch (error) {
        this.logger.error(
          `Failed to refresh tournament window: ${error}`,
          error instanceof Error ? error.stack : undefined
        );
      }
      this.scheduleWindowRefresh(tournamentWorkers);
    }, WINDOW_REFRESH_INTERVAL_MS);
  }

  // --- Scheduling Core ---

  private createInstance(key: string): ScheduledInstance {
    const instance: ScheduledInstance = {
      timer: null,
      running: false,
      aborted: false,
      runPromise: null,
    };
    this.instances.set(key, instance);
    return instance;
  }

  private scheduleInitialRun(
    key: string,
    instance: ScheduledInstance,
    worker: RegisteredWorker,
    context: AsyncWorkerContext
  ): void {
    // Initial delay: random value from 0 to (jitter_factor * interval)
    const intervalMs = this.intervalMs(worker);
    const initialDelay = Math.round(Math.random() * worker.options.jitter * intervalMs);

    instance.timer = setTimeout(() => {
      void this.tick(key, instance, worker, context);
    }, initialDelay);
  }

  private scheduleNextRun(
    key: string,
    instance: ScheduledInstance,
    worker: RegisteredWorker,
    context: AsyncWorkerContext
  ): void {
    if (instance.aborted) return;

    // Apply jitter: interval ± (jitter_factor * interval)
    const intervalMs = this.intervalMs(worker);
    const jitterRange = worker.options.jitter * intervalMs;
    const jitter = (Math.random() * 2 - 1) * jitterRange;
    const delay = Math.max(0, Math.round(intervalMs + jitter));

    instance.timer = setTimeout(() => {
      void this.tick(key, instance, worker, context);
    }, delay);
  }

  private async tick(
    key: string,
    instance: ScheduledInstance,
    worker: RegisteredWorker,
    context: AsyncWorkerContext
  ): Promise<void> {
    if (instance.aborted) return;

    // Overlap prevention
    if (instance.running) {
      const label = this.workerLabel(worker, context);
      this.logger.warn(`Worker ${label} still running, skipping tick`);
      this.scheduleNextRun(key, instance, worker, context);
      return;
    }

    instance.running = true;
    const runPromise = this.executeWorker(worker, context);
    instance.runPromise = runPromise;

    try {
      // Exceptions are caught inside executeWorker — this await only
      // propagates if the worker was aborted or the promise rejects
      // for an unexpected reason (which executeWorker prevents).
      await runPromise;
    } finally {
      instance.running = false;
      instance.runPromise = null;
      this.scheduleNextRun(key, instance, worker, context);
    }
  }

  private async executeWorker(
    worker: RegisteredWorker,
    context: AsyncWorkerContext
  ): Promise<void> {
    const { retry } = worker.options;
    const maxAttempts = retry === false ? 1 : 1 + (retry?.maxRetries ?? 2);
    const minBackoff = retry === false ? 0 : (retry?.minBackoffMs ?? 100);
    const maxBackoff = retry === false ? 0 : (retry?.maxBackoffMs ?? 5000);
    const label = this.workerLabel(worker, context);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await worker.instance.run(context);
        return;
      } catch (error) {
        if (attempt < maxAttempts) {
          const backoff = Math.round(minBackoff + Math.random() * (maxBackoff - minBackoff));
          this.logger.warn(
            `Worker ${label} failed (attempt ${attempt}/${maxAttempts}), retrying in ${backoff}ms: ${error}`
          );
          await new Promise((resolve) => setTimeout(resolve, backoff));
        } else {
          this.logger.error(
            `Worker ${label} failed after ${maxAttempts} attempt(s): ${error}`,
            error instanceof Error ? error.stack : undefined
          );
        }
      }
    }
  }

  // --- Helpers ---

  private isEnabled(): boolean {
    return this.configService.get<string>(ASYNC_WORKERS_ENABLED_ENV) !== 'false';
  }

  private intervalMs(worker: RegisteredWorker): number {
    return worker.options.interval * 1000;
  }

  private workerLabel(worker: RegisteredWorker, context: AsyncWorkerContext): string {
    if (context.pgaTournament) {
      return `"${worker.name}" [tournament:${context.pgaTournament.id}]`;
    }
    return `"${worker.name}"`;
  }

  private formatMs(ms: number): string {
    if (ms >= 3_600_000) return `${Math.round(ms / 3_600_000)}h`;
    if (ms >= 60_000) return `${Math.round(ms / 60_000)}m`;
    return `${Math.round(ms / 1000)}s`;
  }
}
