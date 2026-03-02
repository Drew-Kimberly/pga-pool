import { PgaTournamentPlayerDto } from '../../pga-tournament-player/api/pga-tournament-player.dto';
import { PoolTournamentUserPick } from '../lib/pool-tournament-user-pick.entity';

export class PoolTournamentUserPickDto {
  tier: number;
  /** Field-snapshot odds from pool field generation */
  odds: string | null;
  pga_tournament_player: PgaTournamentPlayerDto;

  static fromEntity(p: PoolTournamentUserPick): PoolTournamentUserPickDto {
    const dto = new PoolTournamentUserPickDto();

    dto.tier = p.pool_tournament_player.tier;
    dto.odds = p.pool_tournament_player.odds ?? null;
    dto.pga_tournament_player = PgaTournamentPlayerDto.fromEntity(
      p.pool_tournament_player.pga_tournament_player
    );

    return dto;
  }
}
