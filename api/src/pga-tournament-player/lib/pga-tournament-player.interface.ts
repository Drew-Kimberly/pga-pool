export enum PlayerStatus {
  Active = 'active',
  Complete = 'complete',
  Withdrawn = 'wd',
  Cut = 'cut',
}

export interface PgaTournamentPlayerFilter {
  tournamentId?: string;
  playerId?: number;
  year?: number;
}
