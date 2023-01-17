export enum OddsLocation {
  NewYork = 'NY',
  NewJersey = 'NJ',
}

export enum OddsProvider {
  Consensus = 'CONSENSUS',
  WilliamHill = 'WILLIAM_HILL',
  Sport888 = 'SPORT_888',
  PointsBet = 'POINTSBET',
  FanDuel = 'FANDUEL',
  DraftKings = 'DRAFTKINGS',
  MGM = 'MGM',
}

export interface GetOddsResponse {
  games: {
    gameID: number;
    /**
     * @note name of tournament
     * @example "Masters Tournament"
     */
    location: string;
  }[];
  players: {
    playerID: number;
    firstName: string;
    lastName: string;
  }[];
  results: {
    gameID: number;
    /**
     * @note The year of the event
     * @example 2023
     */
    season: number;
    sideOdds: {
      provider: OddsProvider;
      playerID: number;
      /**
       * @note the "to-one" ration numerator
       * @example 10 (indicates 10:1 odds)
       */
      price: number;
    }[];
  }[];
}

export interface PgaTournamentOdds {
  metabetTournamentId: number;
  year: number;
  tournamentName: string;
  players: {
    metabetPlayerId: number;
    name: string;
    /**
     * @note the American odds to win the tournament
     * @example 1500 (indicates +1500)
     */
    odds: number;
  }[];
}
