import { PoolTournamentUserPickDto } from '../../pool-tournament-user-pick/api/pool-tournament-user-pick.dto';
import { UserDto } from '../../user/api/user.dto';
import { PoolTournamentUser } from '../lib/pool-tournament-user.entity';

export class PoolTournamentUserDto {
  id: string;
  score: number | null;
  projected_fedex_cup_points: number | null;
  user: UserDto;
  picks: PoolTournamentUserPickDto[];

  static fromEntity(u: PoolTournamentUser): PoolTournamentUserDto {
    const dto = new PoolTournamentUserDto();

    dto.id = u.id;
    dto.score = u.tournament_score;
    dto.projected_fedex_cup_points =
      typeof u.tournament_score === 'number' ? u.projected_fedex_cup_points : null;
    dto.user = UserDto.fromEntity(u.pool_user.user);
    dto.picks = u.picks.map(PoolTournamentUserPickDto.fromEntity);

    return dto;
  }
}
