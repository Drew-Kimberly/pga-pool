import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';

import { PgaTournamentFieldPlayerDto } from './pga-tournament-field.dto';

export class WeeklyPgaTournamentFieldDto {
  constructor(
    public pga_tournament: PgaTournamentDto,
    public players: PgaTournamentFieldPlayerDto[] | null = null
  ) {}
}
