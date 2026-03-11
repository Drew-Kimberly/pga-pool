# Async Worker Framework

The async worker framework provides scheduled, recurring background jobs that run in-process alongside the NestJS API. It replaces the need for an external job queue (BullMQ, Redis, etc.) with a lightweight `setTimeout`-based scheduler that supports per-tournament scoping, jitter, retry with backoff, overlap prevention, and graceful shutdown.

## Architecture

```
AsyncWorkerModule
├── AsyncWorkerRegistry     (OnModuleInit: discovers @AsyncWorker() classes)
├── AsyncWorkerScheduler    (OnApplicationBootstrap: starts scheduling loop)
│   ├── Global workers      (one instance per worker)
│   └── Tournament workers  (one instance per worker × tournament in sync window)
└── depends on: DiscoveryModule, ConfigModule, PgaTournamentModule
```

**Key design choice**: The framework uses `setTimeout` (not `setInterval`) for scheduling. Each tick schedules the *next* tick in its `finally` block. This naturally prevents overlapping runs and allows per-cycle jitter variation.

### Source files

| File | Purpose |
|---|---|
| `api/src/async-worker/async-worker.interface.ts` | Type definitions (`AsyncWorkerOptions`, `AsyncWorkerContext`, `AsyncWorkerHandler`) |
| `api/src/async-worker/async-worker.decorator.ts` | `@AsyncWorker()` class decorator (composes `@Injectable()` + metadata) |
| `api/src/async-worker/async-worker.constants.ts` | Configuration constants (jitter, sync window, refresh interval) |
| `api/src/async-worker/async-worker.registry.ts` | Discovery and validation of decorated classes at module init |
| `api/src/async-worker/async-worker.scheduler.ts` | Core scheduling engine, lifecycle hooks, retry logic |
| `api/src/async-worker/async-worker.module.ts` | NestJS module definition |

## Writing a Worker

### 1. Create the worker class

```ts
import { AsyncWorker } from '../async-worker/async-worker.decorator';
import { AsyncWorkerContext, AsyncWorkerHandler } from '../async-worker/async-worker.interface';

@AsyncWorker({ interval: 900, scope: 'global' })
export class MyWorker implements AsyncWorkerHandler {
  constructor(private readonly myService: MyService) {}

  async run(context: AsyncWorkerContext): Promise<void> {
    await this.myService.doWork();
  }
}
```

The `@AsyncWorker()` decorator automatically applies `@Injectable()`, so no separate decorator is needed.

### 2. Register the worker in a module

```ts
@Module({
  imports: [MyServiceModule],
  providers: [MyWorker],
})
export class MyDataSyncModule {}
```

That module must be imported (directly or transitively) in `AppModule`. The framework discovers workers via `DiscoveryService` — no manual registration in the worker module.

### 3. AsyncWorkerOptions reference

| Option | Type | Default | Description |
|---|---|---|---|
| `interval` | `number` | *required* | Seconds between executions |
| `scope` | `'global' \| 'pga_tournament'` | `'global'` | Scoping strategy (see below) |
| `jitter` | `number` (0–1) | `0.15` | Jitter factor: timing varies ±(jitter × interval) |
| `retry` | `{ maxRetries, minBackoffMs, maxBackoffMs } \| false` | `{ maxRetries: 2, minBackoffMs: 100, maxBackoffMs: 5000 }` | Retry on failure. Set `false` to disable. |

## Scoping

### Global scope

A single instance runs across the entire application. Used for broad data ingestion tasks.

Instance key format: `global:{ClassName}`

### Tournament scope (`pga_tournament`)

The scheduler maintains a **sync window** of ±14 days (`SYNC_WINDOW_DAYS`) from now. For each tournament in that window, the scheduler spawns a separate worker instance. The `context.pgaTournament` property is populated with the tournament entity.

Instance key format: `tournament:{ClassName}:{TournamentId}`

**Window refresh**: Every hour (`WINDOW_REFRESH_INTERVAL_MS`), the scheduler re-queries the database. New tournaments entering the window get workers spawned; tournaments leaving the window have their workers torn down.

Tournament-scoped workers should guard for the expected context:

```ts
async run(context: AsyncWorkerContext): Promise<void> {
  const { pgaTournament } = context;
  if (!pgaTournament) {
    throw new Error('MyWorker requires a pgaTournament context');
  }
  // ...
}
```

## Scheduling Behavior

### Initial delay

Each worker starts with a random initial delay between `0` and `jitter × interval` milliseconds. This distributes startup load across the first interval window, preventing a thundering herd at application boot.

### Jitter

Each subsequent tick applies symmetric jitter: `interval ± (jitter × interval)`. With the default jitter factor of `0.15` and a 60-second interval, actual delays range from 51s to 69s.

### Overlap prevention

If a worker's `run()` is still executing when the next tick fires, the scheduler logs a warning and reschedules without running. This is checked via the `running` flag on each `ScheduledInstance`.

### Retry with backoff

On failure, the scheduler retries with randomized exponential backoff between `minBackoffMs` and `maxBackoffMs`. After exhausting all attempts, it logs the error and moves on — the worker is always rescheduled for its next regular tick regardless of success or failure.

## Lifecycle

### Startup

1. `AsyncWorkerRegistry.onModuleInit()` — Discovers all `@AsyncWorker()` classes via `DiscoveryService`, validates `run()` method, checks for duplicate names, stores in internal map.
2. `AsyncWorkerScheduler.onApplicationBootstrap()` — If enabled, starts global workers immediately and kicks off the first tournament window refresh for tournament-scoped workers.

### Shutdown

`AsyncWorkerScheduler.onApplicationShutdown()`:
1. Clears the window refresh timer
2. Marks all instances as `aborted` and clears their timers
3. Awaits all in-flight `runPromise` values via `Promise.allSettled()`
4. Clears the instance map

This ensures no orphaned async operations after the application shuts down.

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `ASYNC_WORKERS_ENABLED` | `true` | Set to `'false'` to disable all workers at startup |

Constants defined in `async-worker.constants.ts`:

| Constant | Value | Description |
|---|---|---|
| `DEFAULT_JITTER_FACTOR` | `0.15` | Default ±15% timing variation |
| `SYNC_WINDOW_DAYS` | `14` | ±14 days from today for tournament window |
| `WINDOW_REFRESH_INTERVAL_MS` | `3,600,000` (1 hour) | How often to re-query the tournament window |

## Current Workers

All workers live in `api/src/pga-tour-data-sync/` and are provided by `PgaTourDataSyncModule`.

| Worker | Scope | Interval | What it does |
|---|---|---|---|
| `PgaTournamentSyncWorker` | global | 15 min | Ingests/updates PGA tournaments from API for each year in the sync window |
| `PgaPlayerSyncWorker` | global | 1 hour | Refreshes PGA player master data |
| `PgaTournamentFieldSyncWorker` | pga_tournament | 15 min | Syncs the player field for each tournament in the window |
| `PgaTournamentScoreSyncWorker` | pga_tournament | 1 min | Updates leaderboard scores and hole-by-hole data (skips non-`IN_PROGRESS` tournaments) |

### Data flow

```
PgaTournamentSyncWorker ─────→ PgaTournamentIngestor.ingest()
                                  └─ emits 'pga-tournament.status-updated' on status change

PgaPlayerSyncWorker ─────────→ PgaPlayerIngestor.ingest()

PgaTournamentFieldSyncWorker → PgaTournamentPlayerService.upsertFieldForTournament()

PgaTournamentScoreSyncWorker → PgaTournamentPlayerService.updateScores()
                                  └─ emits 'pga-tournament.scores-updated'
                               PgaTournamentPlayerHoleService.ingestScoringData()
```

## Testing

Workers can be integration-tested by resolving them directly from the NestJS test module and calling `run()` with a constructed context:

```ts
const worker = moduleRef.get(PgaTournamentScoreSyncWorker);
await worker.run({ pgaTournament });
```

See `api/src/pga-tour-data-sync/pga-tournament-score-sync.worker.integration.spec.ts` for a full example that:
1. Creates tournament + player entities via factories
2. Stubs the PGA Tour API responses
3. Calls `worker.run()` directly
4. Asserts database state was updated correctly

The scheduler itself is not exercised in integration tests — workers are tested in isolation by invoking `run()` directly.

## Design Decisions

- **No external broker**: The application is single-instance, so an in-process scheduler avoids the operational complexity of Redis/BullMQ.
- **setTimeout over setInterval**: Prevents cascading overlaps and allows per-tick jitter.
- **Fire-and-forget retry**: Failed workers are retried within the same tick, then the scheduler moves on. There is no dead-letter queue or persistent failure tracking.
- **Separation from domain events**: Workers handle *when* to poll; domain events handle *what happens next* when data changes. This keeps workers thin (typically 5–15 lines of `run()` logic).
