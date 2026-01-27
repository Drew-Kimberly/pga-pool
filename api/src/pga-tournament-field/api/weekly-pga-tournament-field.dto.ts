import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';

import { PgaTournamentFieldPlayerDto } from './pga-tournament-field.dto';

export class WeeklyPgaTournamentFieldDto {
  constructor(
    public pga_tournament: PgaTournamentDto,
    /**
     * @note timestamp in ISO-8601 format, null if no field data exists
     */
    public created_at: string | null,
    public player_tiers: {
      [tier: number]: PgaTournamentFieldPlayerDto[];
    } | null = null
  ) {}
}
