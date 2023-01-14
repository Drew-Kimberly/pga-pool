export enum PlayerStatus {
  Active = 'active',
  Withdrawn = 'wd',
}

export interface PgaTournamentPlayerFilter {
  tournamentId?: string;
  playerId?: number;
  year?: number;
}
