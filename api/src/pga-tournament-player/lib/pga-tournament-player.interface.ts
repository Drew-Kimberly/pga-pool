export enum PlayerStatus {
  Active = 'active',
  Withdrawn = 'wd',
  Cut = 'cut',
}

export interface PgaTournamentPlayerFilter {
  tournamentId?: string;
  playerId?: number;
  year?: number;
}
