import { UserDto } from '../../user/api/user.dto';
import { PoolUser } from '../lib/pool-user.entity';

export class PoolUserDto {
  id: string;
  pool_id: string;
  pool_score: number;
  rank: number;
  user: UserDto;
  created_at: string;
  updated_at: string;

  static fromEntity(u: PoolUser, rank?: number): PoolUserDto {
    const dto = new PoolUserDto();
    dto.id = u.id;
    dto.pool_id = u.pool_id;
    dto.pool_score = u.pool_score;
    dto.rank = rank ?? 0;
    dto.user = UserDto.fromEntity(u.user);
    dto.created_at = u.created_at.toISOString();
    dto.updated_at = u.updated_at.toISOString();
    return dto;
  }
}
