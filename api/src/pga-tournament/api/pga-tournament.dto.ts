export class PgaTournamentDto {
  id: string;
  name: string;
  date: {
    year: number;
    start: string;
    end: string;
    /**
     * @example "America/Los_Angeles"
     */
    timezone: string;
  };
}
