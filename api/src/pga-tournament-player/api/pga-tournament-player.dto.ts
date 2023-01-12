import { PgaPlayerDto } from '../../pga-player/api/pga-player.dto';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { EmptyValue, PlayerStatus } from '../lib/pga-tournament-player.interface';

export class PgaTournamentPlayerDto {
  id: string;
  active: boolean;
  status: PlayerStatus;
  is_round_complete: boolean;
  current_round: number | EmptyValue;
  current_hole: number;
  starting_hole: number;
  /** @example "7:10am" */
  tee_time: string | null;
  score_total: number;
  score_thru: number | EmptyValue;
  current_position: string | EmptyValue;
  withdrawn: boolean;
  pga_player: PgaPlayerDto;
  pga_tournament: PgaTournamentDto;
}
