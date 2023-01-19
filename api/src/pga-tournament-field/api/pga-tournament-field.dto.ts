import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';

export class PgaTournamentFieldDto {
  constructor(
    public pga_tournament: PgaTournamentDto,
    /**
     * @note timestamp in ISO-8601 format
     */
    public created_at: string,
    public player_tiers: {
      [tier: number]: PgaTournamentFieldPlayerDto[];
    } = {}
  ) {}
}

export class PgaTournamentFieldPlayerDto {
  player_id: number;
  name: string;
  odds: string;
}
