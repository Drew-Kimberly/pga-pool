import { EventEmitter } from 'node:events';

import { Injectable } from '@nestjs/common';

export interface PgaTournamentScoresUpdatedPayload {
  pgaTournamentId: string;
}

export interface PgaTournamentCompletedPayload {
  pgaTournamentId: string;
}

// Add new event payload types here as needed

export type AsyncEventPayloads = {
  'pga-tournament.scores-updated': PgaTournamentScoresUpdatedPayload;
  'pga-tournament.completed': PgaTournamentCompletedPayload;
};

export type AsyncEventName = keyof AsyncEventPayloads;

@Injectable()
export class AsyncWorkerEventBus extends EventEmitter {
  emit<E extends AsyncEventName>(event: E, payload: AsyncEventPayloads[E]): boolean {
    return super.emit(event, payload);
  }

  on<E extends AsyncEventName>(event: E, listener: (payload: AsyncEventPayloads[E]) => void): this {
    return super.on(event, listener);
  }
}
