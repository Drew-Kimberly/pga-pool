import { PoolTournamentUserPickDto } from '../../pool-tournament-user-pick/api/pool-tournament-user-pick.dto';
import { UserDto } from '../../user/api/user.dto';
import { PoolTournamentUser } from '../lib/pool-tournament-user.entity';

export class PoolTournamentUserDto {
  id: string;
  rank: string;
  score: number | null;
  fedex_cup_points: number | null;
  user: UserDto;
  picks: PoolTournamentUserPickDto[];

  static fromEntity(u: PoolTournamentUser, rank: string): PoolTournamentUserDto {
    const dto = new PoolTournamentUserDto();

    dto.id = u.id;
    dto.rank = rank;
    dto.score = u.tournament_score;
    dto.fedex_cup_points = typeof u.tournament_score === 'number' ? u.fedex_cup_points : null;
    dto.user = UserDto.fromEntity(u.pool_user.user);
    dto.picks = u.picks.map(PoolTournamentUserPickDto.fromEntity);

    return dto;
  }
}
