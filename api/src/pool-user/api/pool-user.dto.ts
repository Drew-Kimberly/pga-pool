import { PgaTournamentPlayerDto } from '../../pga-tournament-player/api/pga-tournament-player.dto';
import { UserDto } from '../../user/api/user.dto';

export class PoolUserDto {
  id: string;
  score: number;
  user: UserDto;
  picks: PgaTournamentPlayerDto[];
}
