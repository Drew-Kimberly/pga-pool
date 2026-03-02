import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PgaTournamentFieldPlayer } from '../lib/pga-tournament-field.interface';

export class PgaTournamentFieldDto {
  constructor(
    public pga_tournament: PgaTournamentDto,
    public players: PgaTournamentFieldPlayerDto[]
  ) {}
}

export class PgaTournamentFieldPlayerDto implements PgaTournamentFieldPlayer {
  player_id: number;
  name: string;
}
