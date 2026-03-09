import { PgaTournament } from '../pga-tournament/lib/pga-tournament.entity';

export type AsyncWorkerScope = 'global' | 'pga_tournament';

export interface AsyncWorkerRetryOptions {
  /** Maximum number of retries after the initial attempt. Default: 2 */
  maxRetries?: number;
  /** Minimum backoff in milliseconds. Default: 100 */
  minBackoffMs?: number;
  /** Maximum backoff in milliseconds. Default: 5000 */
  maxBackoffMs?: number;
}

export interface AsyncWorkerOptions {
  /** Interval in seconds between executions */
  interval: number;
  /** Jitter factor (0–1). Default: 0.15 (±15% of interval) */
  jitter?: number;
  /** Scope. 'pga_tournament' runs one instance per tournament in the sync window. Default: 'global' */
  scope?: AsyncWorkerScope;
  /** Retry configuration. Set to false to disable retries. Default: { maxRetries: 2, minBackoffMs: 100, maxBackoffMs: 5000 } */
  retry?: AsyncWorkerRetryOptions | false;
}

export interface AsyncWorkerContext {
  /** Populated for pga_tournament-scoped workers */
  pgaTournament?: PgaTournament;
}

export interface AsyncWorkerHandler {
  run(context: AsyncWorkerContext): Promise<void>;
}
