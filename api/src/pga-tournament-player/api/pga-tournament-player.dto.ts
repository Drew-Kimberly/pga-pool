import { PgaPlayerDto } from '../../pga-player/api/pga-player.dto';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PgaTournamentPlayer } from '../lib/pga-tournament-player.entity';
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
  projected_fedex_cup_points: number;
  official_fedex_cup_points: number | null;
  withdrawn: boolean;
  pga_player: PgaPlayerDto;
  pga_tournament: PgaTournamentDto;

  static fromEntity(p: PgaTournamentPlayer): PgaTournamentPlayerDto {
    const dto = new PgaTournamentPlayerDto();

    dto.id = p.id;
    dto.active = p.active;
    dto.status = p.status;
    dto.is_round_complete = p.is_round_complete;
    dto.current_round = p.current_round;
    dto.current_hole = p.current_hole;
    dto.starting_hole = p.starting_hole;
    dto.tee_time = p.tee_time;
    dto.score_total = p.score_total;
    dto.score_thru = p.score_thru;
    dto.current_position = p.current_position;
    dto.projected_fedex_cup_points = p.projected_fedex_cup_points;
    dto.official_fedex_cup_points = p.official_fedex_cup_points;
    dto.withdrawn = p.status === PlayerStatus.Withdrawn;
    dto.pga_player = PgaPlayerDto.fromEntity(p.pga_player);
    dto.pga_tournament = PgaTournamentDto.fromEntity(p.pga_tournament);

    return dto;
  }
}
