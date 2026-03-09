import { PgaTournament } from '../pga-tournament/lib/pga-tournament.entity';

export type AsyncWorkerScope = 'global' | 'pga_tournament';

export interface AsyncWorkerOptions {
  /** Interval in milliseconds between executions */
  interval: number;
  /** Jitter factor (0–1). Default: 0.15 (±15% of interval) */
  jitter?: number;
  /** Scope. 'pga_tournament' runs one instance per tournament in the sync window. Default: 'global' */
  scope?: AsyncWorkerScope;
}

export interface AsyncWorkerContext {
  /** Populated for pga_tournament-scoped workers */
  pgaTournament?: PgaTournament;
}

export interface AsyncWorkerHandler {
  run(context: AsyncWorkerContext): Promise<void>;
}
