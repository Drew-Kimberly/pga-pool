import { EventEmitter } from 'node:events';

import { Injectable } from '@nestjs/common';

/**
 * Extensible event map. Each domain module augments this interface
 * via TypeScript declaration merging in its own `*.events.ts` file.
 *
 * @example
 * // In pga-tournament.events.ts:
 * declare module '../../domain-events/domain-event-bus' {
 *   interface DomainEventMap {
 *     'pga-tournament.scores-updated': PgaTournamentScoresUpdatedPayload;
 *   }
 * }
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DomainEventMap {}

export type DomainEventName = keyof DomainEventMap & string;

@Injectable()
export class DomainEventBus extends EventEmitter {
  emit<E extends DomainEventName>(event: E, payload: DomainEventMap[E]): boolean {
    return super.emit(event, payload);
  }

  on<E extends DomainEventName>(event: E, listener: (payload: DomainEventMap[E]) => void): this {
    return super.on(event, listener);
  }
}
