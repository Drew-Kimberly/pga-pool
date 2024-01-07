import { PgaTournament } from './pga-tournament.entity';

export enum PgaTournamentFormat {
  Stroke = 'stroke',
  Match = 'match',
  Team = 'team',
  TeamMatch = 'team-match',
  Stableford = 'stableford',
}

export type SavePgaTournament = PgaTournament;

export enum PgaTournamentFeatures {
  FIELD = 'FIELD',
  ODDS = 'ODDS',
  TEE_TIMES = 'TEE_TIMES',
  LEADERBOARD = 'LEADERBOARD',
  STANDINGS = 'STANDINGS',
}

export enum PgaTournamentStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum PgaTournamentRoundStatus {
  UPCOMING = 'UPCOMING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  OFFICIAL = 'OFFICIAL',
}

export enum PgaTournamentScoringFormat {
  STROKE_PLAY = 'STROKE_PLAY',
  TEAM_STROKE = 'TEAM_STROKE',
  STABLEFORD = 'STABLEFORD',
}
