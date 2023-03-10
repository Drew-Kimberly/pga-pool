import { PgaTournamentPlayerDto } from '../../pga-tournament-player/api/pga-tournament-player.dto';
import { UserDto } from '../../user/api/user.dto';

export class PoolUserDto {
  id: string;
  score: number | null;
  projected_fedex_cup_points: number | null;
  user: UserDto;
  picks: PgaTournamentPlayerDto[];
}
