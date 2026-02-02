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

export interface PgaApiTourScheduleTournament {
  /** @example "R2024016" */
  id: string;
  tournamentName: string;
  /** @note URL to the logo */
  tournamentLogo: string;
  /** @note URL to a nice image of the course */
  beautyImage: string;
  /**
   * Epoch with millisecond precision.
   *
   * Points to the start of the day the tournament begins, NOT the time of the first tee-off.
   *
   * @example 1704326400000
   */
  startDate: number;
  /** @example "Jan 4 - 7" */
  date: string;
  /** @example "January 4th through January 7th" */
  dateAccessibilityText: string;
  tourStandingHeading: 'FEDEXCUP' | string;
  /** @example "700 pts" */
  tourStandingValue: string;
  /** @example "United States of America" */
  country: string;
  /** @example "USA" */
  countryCode: string;
  /** @example "Hawaii" */
  state: string;
  /** @example "HI" */
  stateCode: string;
  city: string;
  courseName: string;
  /** @example "Jon Rahm" */
  champion: string;
  /** PlayerID @example "46970" */
  championId: string;
  /** @example "$20,000,000" */
  purse: string;
}

export interface PgaApiTourScheduleTournaments {
  /** @example "January" */
  month: string;
  monthSort: number;
  /** @example "2024" */
  year: string;
  tournaments: PgaApiTourScheduleTournament[];
}

export interface PgaApiTournamentSchedule {
  completed: PgaApiTourScheduleTournaments[];
  /** @example "2024" */
  seasonYear: string;
  upcoming: PgaApiTourScheduleTournaments[];
}

export interface PgaApiTournamentScheduleResponse {
  schedule: PgaApiTournamentSchedule;
}

export type TournamentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type RoundStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETE' | 'OFFICIAL';
export type ScoringFormat = 'STROKE_PLAY' | 'TEAM_STROKE' | 'STABLEFORD';
export type TournamentFeatures = 'FIELD' | 'ODDS' | 'LEADERBOARD' | 'TEE_TIMES' | 'STANDINGS';

export interface PgaApiTournament {
  /** @example "R2024016" */
  id: string;
  tournamentName: string;
  tournamentStatus: TournamentStatus;
  roundStatus: RoundStatus;
  /** @note -1 when tournament is upcoming */
  currentRound: number;
  /** @example "Pacific/Honolulu" */
  timezone: string;
  formatType: ScoringFormat;
  features: TournamentFeatures[];
}

export interface PgaApiTournamentsResponse {
  tournaments: PgaApiTournament[];
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
