// Event payloads for the PGA Tournament domain

export interface PgaTournamentScoresUpdatedPayload {
  pgaTournamentId: string;
}

export interface PgaTournamentCompletedPayload {
  pgaTournamentId: string;
}

// Augment the DomainEventMap so the event bus is fully typed
declare module '../../domain-events/domain-event-bus' {
  interface DomainEventMap {
    'pga-tournament.scores-updated': PgaTournamentScoresUpdatedPayload;
    'pga-tournament.completed': PgaTournamentCompletedPayload;
  }
}
