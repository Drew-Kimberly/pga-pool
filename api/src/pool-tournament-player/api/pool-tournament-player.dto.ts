import { PgaTournamentPlayerDto } from '../../pga-tournament-player/api/pga-tournament-player.dto';
import { PoolTournamentPlayer } from '../lib/pool-tournament-player.entity';

export class PoolTournamentPlayerDto {
  id: string;
  tier: number;
  odds: string | null;
  pga_tournament_player: PgaTournamentPlayerDto;

  static fromEntity(p: PoolTournamentPlayer): PoolTournamentPlayerDto {
    const dto = new PoolTournamentPlayerDto();
    dto.id = p.id;
    dto.tier = p.tier;
    dto.odds = p.odds ?? null;
    dto.pga_tournament_player = PgaTournamentPlayerDto.fromEntity(p.pga_tournament_player);
    return dto;
  }
}
