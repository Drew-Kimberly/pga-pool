import { PgaPlayerDto } from '../../pga-player/api/pga-player.dto';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PlayerStatus } from '../lib/pga-tournament-player.interface';

export class PgaTournamentPlayerDto {
  /** @note "{playerId}-{tournamentId} format" */
  id: string;
  active: boolean;
  status: PlayerStatus;
  is_round_complete: boolean;
  current_round: number | null;
  current_hole: number | null;
  starting_hole: number;
  /** @example "7:10am" */
  tee_time: string | null;
  score_total: number | null;
  score_thru: number | null;
  current_position: string | null;
  withdrawn: boolean;
  pga_player: PgaPlayerDto;
  pga_tournament: PgaTournamentDto;
}
