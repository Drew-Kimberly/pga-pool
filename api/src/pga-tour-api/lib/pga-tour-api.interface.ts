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
