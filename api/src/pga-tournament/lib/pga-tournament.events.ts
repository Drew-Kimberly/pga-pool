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
