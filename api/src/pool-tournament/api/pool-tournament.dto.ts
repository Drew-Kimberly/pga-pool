import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PoolDto } from '../../pool/lib/pool.dto';
import { PoolTournamentUserDto } from '../../pool-tournament-user/api/pool-tournament-user.dto';
import { PoolTournament } from '../lib/pool-tournament.entity';

export class PoolTournamentDto {
  id: string;
  pga_tournament: PgaTournamentDto;
  pool: PoolDto;
  pool_tournament_users: PoolTournamentUserDto[] = [];

  static fromEntity(t: PoolTournament): PoolTournamentDto {
    const dto = new PoolTournamentDto();

    dto.id = t.id;
    dto.pga_tournament = PgaTournamentDto.fromEntity(t.pga_tournament);
    dto.pool = PoolDto.fromEntity(t.pool);
    dto.pool_tournament_users = t.pool_tournament_users.map(PoolTournamentUserDto.fromEntity);

    return dto;
  }
}
