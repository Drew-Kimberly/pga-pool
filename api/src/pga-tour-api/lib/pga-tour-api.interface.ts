export interface PgaTourApiPlayer {
  pid: string;
  nameF: string;
  nameL: string;
  yrs: string[];
}

export interface PgaTourApiPlayersResponse {
  plrs: PgaTourApiPlayer[];
}
