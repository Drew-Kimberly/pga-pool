import { EventEmitter } from 'node:events';

import { Injectable } from '@nestjs/common';

/**
 * Typed domain event bus.
 *
 * Each domain module exports its own event map interface.
 * Emitters pass the map as a type parameter for compile-time safety:
 *
 * @example
 * this.eventBus.emit<PgaTournamentEventMap>('pga-tournament.scores-updated', { pgaTournament });
 */
@Injectable()
export class DomainEventBus extends EventEmitter {
  emit<TMap extends Record<string, unknown> = Record<string, unknown>>(
    ...args: { [K in keyof TMap & string]: [event: K, payload: TMap[K]] }[keyof TMap & string]
  ): boolean {
    const [event, payload] = args;
    return super.emit(event, payload);
  }
}
