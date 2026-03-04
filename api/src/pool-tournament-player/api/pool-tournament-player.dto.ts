import { PgaTournamentPlayerDto } from '../../pga-tournament-player/api/pga-tournament-player.dto';
import { RoundSummaryDto } from '../../pga-tournament-player-hole/api/pga-tournament-player-hole.dto';
import { PoolTournamentPlayer } from '../lib/pool-tournament-player.entity';

export class PoolTournamentPlayerDto {
  id: string;
  tier: number;
  odds: string | null;
  pga_tournament_player: PgaTournamentPlayerDto;

  static fromEntity(
    p: PoolTournamentPlayer,
    roundsMap?: Map<string, RoundSummaryDto[]>
  ): PoolTournamentPlayerDto {
    const dto = new PoolTournamentPlayerDto();
    dto.id = p.id;
    dto.tier = p.tier;
    dto.odds = p.odds ?? null;
    dto.pga_tournament_player = PgaTournamentPlayerDto.fromEntity(
      p.pga_tournament_player,
      roundsMap?.get(p.pga_tournament_player.id) ?? []
    );
    return dto;
  }
}
