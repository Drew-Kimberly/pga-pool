export enum PoolType {
  SingleTournament = 'single_tournament',
  Season = 'season',
}

export enum PoolScoringFormat {
  Strokes = 'strokes',
  FedexCuptPoints = 'fedex_cup_points',
}

export interface PoolSettings {
  scoring_format: PoolScoringFormat;
  include_LIV?: boolean;
}

export interface CreatePool {
  league_id: string;
  name: string;
  year: number;
  type: PoolType;
  settings: PoolSettings;
  tournaments?: Set<string>;
  users?: Set<string>;
}

export interface UpdatePool {
  id: string;
  name?: string;
  year?: number;
  settings?: PoolSettings;
  tournaments?: Set<string>;
  users?: Set<string>;
}
