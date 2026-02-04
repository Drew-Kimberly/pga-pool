import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PoolDto } from '../../pool/lib/pool.dto';
import { PoolTournament } from '../lib/pool-tournament.entity';

export class PoolTournamentDto {
  id: string;
  pga_tournament: PgaTournamentDto;
  pool: PoolDto;
  scores_are_official: boolean;

  static fromEntity(t: PoolTournament): PoolTournamentDto {
    const dto = new PoolTournamentDto();

    dto.id = t.id;
    dto.pga_tournament = PgaTournamentDto.fromEntity(t.pga_tournament);
    dto.pool = PoolDto.fromEntity(t.pool);
    dto.scores_are_official = t.scores_are_official;

    return dto;
  }
}
