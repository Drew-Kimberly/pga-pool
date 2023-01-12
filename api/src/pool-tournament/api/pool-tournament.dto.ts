import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PoolUserDto } from '../../pool-user/api/pool-user.dto';

export class PoolTournamentDto {
  id: string;
  active: boolean;
  pga_tournament: PgaTournamentDto;
  pool_users: PoolUserDto[] = [];
}
