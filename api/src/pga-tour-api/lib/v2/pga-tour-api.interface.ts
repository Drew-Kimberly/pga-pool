export type PgaTourCode = 'R';

export interface PgaApiPlayer {
  id: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  shortName: string;
  displayName: string;
  country: string;
  countryFlag: string;
  headshot: string;
  alphaSort: string;
}

export interface PgaApiPlayersResponse {
  tourCode: PgaTourCode;
  players: PgaApiPlayer[];
}

export interface PgaApiTournamentLeaderboardRow {
  /** @note PGA Player ID */
  id: string;
  player: {
    firstName: string;
    lastName: string;
    displayName: string;
  };
  scoringData: {
    /**
     * @example "T3"
     * @note can be empty "--" value
     */
    position: string;
    /**
     * @note can be empty "--" value
     * @example "+1"
     * @example "-2"
     * @example "E"
     */
    total: string;
    totalSort: number;
    /** @note can be empty "--" value or "F" for finished */
    thru: string;
    /** @note value of 19 denotes finished */
    thruSort: number;
    /**
     * @note the round score, I believe
     */
    score: string;
    scoreSort: number;
    /**
     * @note teeTime is -1 when unavailable.
     */
    teeTime: string | -1;
    courseId: string;
    groupNumber: number;
    currentRound: number;
    /** @example "R1" */
    roundHeader: string;
    /** @example "R1 Completed" */
    roundStatus: string;
    playerState: string;
    totalStrokes: string;
    /** @example "+5000" */
    oddsToWin: string;
  };
}

export interface PgaApiTournamentLeaderboardResponse {
  /**
   * @note formatted "R{year}{tournamentId}"
   * @example "R2023003"
   */
  leaderboardId: string;
  leaderboard: {
    /** @example "America/Los_Angeles" */
    timezone: string;
    roundStatus: 'IN_PROGRESS';
    tournamentStatus: 'IN_PROGRESS';
    formatType: 'STROKE_PLAY';
    players: PgaApiTournamentLeaderboardRow[];
  };
}

export interface PgaApiProjectedPlayerPoints {
  playerId: string;
  firstName: string;
  lastName: string;
  /**
   * @note empty when player is not participating in the current tournament
   * @note R{year}{tourneyId} format
   * @example "R2023004"
   */
  tournamentId: string | '';
  tournamentName: string | '';
  /**
   * @example "T3"
   */
  playerPosition: string | 'CUT' | '';
  /**
   * @example "52.000"
   * @note Only populated while a tournament is active; PGA Tour API returns "0" after completion.
   */
  projectedEventPoints: string;
}

export interface PgaApiProjectedFedexCupPointsResponse {
  seasonYear: number;
  /**
   * @example "2023-01-26T19:16:21"
   */
  lastUpdated: string;

  points: PgaApiProjectedPlayerPoints[];
}

export interface PgaApiPlayerSeasonResultsResponse {
  resultsData?: Array<{
    title?: string;
    data?: Array<{
      tournamentId: string;
      fields: string[];
    }>;
  }>;
}
