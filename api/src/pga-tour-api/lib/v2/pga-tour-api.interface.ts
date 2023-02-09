export interface PgaApiPlayer {
  pid: string;
  nameF: string;
  nameL: string;
  yrs: string[];
}

export interface PgaApiPlayersResponse {
  plrs: PgaApiPlayer[];
}

export interface PgaApiTourTournament {
  /** @note permNum + year can be used to identify tourney */
  permNum: string;
  trnName: {
    long: string;
    short: string;
  };
  year: string;
  /** @example "America/Los_Angeles" */
  timeZone: string;
  date: {
    weekNumber: string;
    /** @example  2023-01-09 */
    start: string;
    /** @example  2023-01-15 */
    end: string;
  };
  format: 'stroke' | 'match' | 'team match' | 'Team' | 'Stableford' | '';
  FedExCup: 'Yes' | 'No';
  /** @example "2,989" */
  FedExCupPurse: string;
  FedExCupWinnerPoints: string;
}

export interface PgaApiTourTournaments {
  desc: 'PGA TOUR' | 'PGA TOUR Champions' | 'Korn Ferry Tour';
  trns: PgaApiTourTournament[];
}

export interface PgaApiTournamentScheduleYear {
  year: string;
  tours: PgaApiTourTournaments[];
}

export interface PgaApiTournamentScheduleResponse {
  currenYears: {
    /** @example "2023" */
    c: string;
  };
  thisWeek: {
    weekNumber: string;
    /** @example  2023-01-09 */
    startDate: string;
    /** @example  2023-01-15 */
    endDate: string;
  };
  years: PgaApiTournamentScheduleYear[];
}

export interface PgaApiTournamentLeaderboardRow {
  /** @note PGA Player ID */
  id: string;
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
  playerState: 'ACTIVE';
  totalStrokes: string;
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
