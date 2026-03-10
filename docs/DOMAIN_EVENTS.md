# Domain Events

The domain event system provides in-process, fire-and-forget event handling for reacting to state changes in the application. It uses a typed `EventEmitter` wrapper (`DomainEventBus`) with decorator-based handler discovery, automatic retry with backoff, and compile-time type safety for event names and payloads.

## Architecture

```
DomainEventModule (@Global)
├── DomainEventBus              (typed EventEmitter — injectable singleton)
├── DomainEventRegistry         (OnApplicationBootstrap: discovers @OnDomainEvent() handlers, wires listeners)
└── depends on: DiscoveryModule
```

Domain events decouple the *producer* of a state change from the *consumers* that react to it. A service emits an event on the bus; zero or more handlers respond asynchronously in the same process. The emitter does not wait for handlers to complete and is unaffected by handler failures.

### Source files

| File | Purpose |
|---|---|
| `api/src/domain-events/domain-event.interface.ts` | Type definitions (`DomainEventHandler<T>`, `DomainEventRetryOptions`, `OnDomainEventOptions`) |
| `api/src/domain-events/domain-event.decorator.ts` | `@OnDomainEvent()` class decorator (composes `@Injectable()` + metadata) |
| `api/src/domain-events/domain-event-bus.ts` | `DomainEventBus` — typed wrapper around Node.js `EventEmitter` |
| `api/src/domain-events/domain-event.registry.ts` | Handler discovery, validation, and listener wiring with retry logic |
| `api/src/domain-events/domain-event.module.ts` | `@Global()` NestJS module — available everywhere without explicit import |

## Type-Safe Event Bus

The `DomainEventBus` extends Node.js's `EventEmitter` with a generic `emit<TMap>()` signature that enforces compile-time type safety:

```ts
// From domain-event-bus.ts
export class DomainEventBus extends EventEmitter {
  emit<TMap extends Record<string, unknown> = Record<string, unknown>>(
    ...args: { [K in keyof TMap & string]: [event: K, payload: TMap[K]] }[keyof TMap & string]
  ): boolean {
    const [event, payload] = args;
    return super.emit(event, payload);
  }
}
```

Each domain module defines its own **event map** interface that maps event names to payload types. Emitters pass this map as a type parameter, giving full autocomplete and type checking:

```ts
// Emitting with type safety
this.eventBus.emit<PgaTournamentEventMap>('pga-tournament.scores-updated', { pgaTournament });
//                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^   ^^^^^^^^^^^^^^^^^
//                                        autocompleted event name           typed payload
```

If the event name or payload shape doesn't match the map, TypeScript produces a compile error.

## Defining Events

### 1. Create an event map

Each domain module that emits events should define its event types in a `*.events.ts` file:

```ts
// pga-tournament.events.ts
import type { PgaTournament } from './pga-tournament.entity';
import type { PgaTournamentStatus } from './pga-tournament.interface';

export interface PgaTournamentStatusUpdatedPayload {
  pgaTournament: PgaTournament;
  previousStatus: PgaTournamentStatus;
  newStatus: PgaTournamentStatus;
}

export interface PgaTournamentScoresUpdatedPayload {
  pgaTournament: PgaTournament;
}

export type PgaTournamentEventMap = {
  'pga-tournament.status-updated': PgaTournamentStatusUpdatedPayload;
  'pga-tournament.scores-updated': PgaTournamentScoresUpdatedPayload;
};
```

**Naming convention**: Event names follow the pattern `{domain}.{verb-past-tense}` (e.g., `pga-tournament.status-updated`).

### 2. Emit events from services

Inject `DomainEventBus` (available globally, no module import needed) and call `emit()`:

```ts
import { DomainEventBus } from '../../domain-events/domain-event-bus';
import { PgaTournamentEventMap } from './pga-tournament.events';

@Injectable()
export class MyService {
  constructor(private readonly eventBus: DomainEventBus) {}

  async doSomething(): Promise<void> {
    // ... perform state change ...
    this.eventBus.emit<PgaTournamentEventMap>('pga-tournament.scores-updated', {
      pgaTournament,
    });
  }
}
```

**Important**: `emit()` is fire-and-forget from the caller's perspective. The method returns `boolean` (from `EventEmitter.emit`) synchronously; handlers execute asynchronously afterward.

## Writing Event Handlers

### 1. Create the handler class

```ts
import { OnDomainEvent } from '../../domain-events/domain-event.decorator';
import { DomainEventHandler } from '../../domain-events/domain-event.interface';
import type { PgaTournamentScoresUpdatedPayload } from '../../pga-tournament/lib/pga-tournament.events';

@OnDomainEvent('pga-tournament.scores-updated')
export class MyReactionHandler implements DomainEventHandler<PgaTournamentScoresUpdatedPayload> {
  constructor(private readonly myService: MyService) {}

  async handle(payload: PgaTournamentScoresUpdatedPayload): Promise<void> {
    // React to the event
  }
}
```

The `@OnDomainEvent()` decorator automatically applies `@Injectable()`.

### 2. Register in a module

```ts
@Module({
  providers: [MyReactionHandler],
})
export class MyModule {}
```

The handler is automatically discovered and wired at application bootstrap — no manual event bus subscription needed.

### 3. OnDomainEventOptions reference

| Option | Type | Default | Description |
|---|---|---|---|
| `retry` | `{ maxRetries, minBackoffMs, maxBackoffMs } \| false` | `{ maxRetries: 2, minBackoffMs: 0, maxBackoffMs: 100 }` | Retry on failure. Set `false` to disable. |

Note: Domain event retry defaults are faster than async worker retry defaults (0–100ms vs 100–5000ms) because events are expected to be lightweight reactions, not heavy polling operations.

## Retry Behavior

When a handler's `handle()` method throws, the registry's wrapper retries with randomized backoff:

1. **Attempt 1** fails → log warning, wait `random(minBackoffMs..maxBackoffMs)`, retry
2. **Attempt 2** fails → log warning, wait, retry
3. **Attempt 3** fails → log error with stack trace, give up

Each handler operates independently. If handler A fails and handler B succeeds for the same event, only handler A retries. A handler's failure never blocks other handlers or the emitter.

After all retries are exhausted, the failure is only logged — there is no dead-letter queue or persistent failure record. This is appropriate for the application's scale: the next scheduled worker tick will produce fresh events.

## Current Events and Handlers

### Events

Defined in `api/src/pga-tournament/lib/pga-tournament.events.ts`:

| Event | Payload | Emitted by | When |
|---|---|---|---|
| `pga-tournament.status-updated` | `{ pgaTournament, previousStatus, newStatus }` | `PgaTournamentIngestor.ingest()` | A tournament's status changes (e.g., `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED`) |
| `pga-tournament.scores-updated` | `{ pgaTournament }` | `PgaTournamentPlayerService.updateScores()` | Leaderboard scores have been refreshed from the PGA Tour API |

### Handlers

| Handler | Event | Module | What it does |
|---|---|---|---|
| `PoolScoreReactionHandler` | `pga-tournament.scores-updated` | `PoolTournamentModule` | Recalculates `tournament_score` and `fedex_cup_points` for all pool users via a single aggregate UPDATE query |
| `PoolFinalizationReactionHandler` | `pga-tournament.status-updated` | `PoolTournamentModule` | When a tournament completes: adds each user's tournament score to their cumulative `pool_score` and marks the tournament as official (wrapped in a transaction) |

### Data flow diagram

```
PGA Tour API polling (async workers)
│
├─ PgaTournamentIngestor.ingest()
│   └─ status changed? ──→ emit 'pga-tournament.status-updated'
│                               └─→ PoolFinalizationReactionHandler
│                                     └─ if COMPLETED: finalize scores (transaction)
│
└─ PgaTournamentPlayerService.updateScores()
    └─ emit 'pga-tournament.scores-updated'
         └─→ PoolScoreReactionHandler
               └─ UPDATE pool_tournament_user scores (aggregate SQL)
```

## Module Setup

`DomainEventModule` is decorated with `@Global()`, so `DomainEventBus` is injectable everywhere without adding `DomainEventModule` to a consuming module's `imports` array.

```ts
// app.module.ts — imported once at the root
@Module({
  imports: [
    RegisteredDatabaseModule,
    DomainEventModule,       // Global — makes DomainEventBus available everywhere
    AsyncWorkerModule,
    // ...
  ],
})
export class AppModule {}
```

## Relationship with Async Workers

The async worker framework and domain events are complementary systems:

| Concern | Async Workers | Domain Events |
|---|---|---|
| Trigger | Time-based (interval) | State change (emit) |
| Direction | Pull (poll external API) | Push (react to internal change) |
| Coupling | Worker knows what to poll | Emitter doesn't know its consumers |
| Concurrency | One instance per scope, overlap-prevented | All handlers run concurrently per event |
| Lifecycle | Managed by scheduler (start/stop/reschedule) | Fire-and-forget from emitter |

A typical flow: an async worker polls the PGA Tour API, updates the database, then emits a domain event. Handlers react to the event by updating downstream state (pool scores, finalization). The worker doesn't know or care what handlers exist.

## Design Decisions

- **In-process EventEmitter**: Avoids the complexity of an external message broker. Appropriate for a single-instance application where all consumers are co-located.
- **Typed event maps**: Provide compile-time safety without a complex event registry. Each domain owns its own type definitions.
- **Fire-and-forget semantics**: Handlers cannot block the emitter or each other. This keeps the critical path (API ingestion) fast and isolated from downstream failures.
- **Fast retry defaults** (0–100ms): Event handlers typically perform a single DB query, so retries should be near-instant. Compare with async worker retries (100–5000ms) which account for external API latency.
- **Handler naming convention**: `*ReactionHandler` suffix distinguishes event handlers from services, making their purpose immediately clear in the codebase.
