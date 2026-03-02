import { PoolTournamentDto } from '../../pool-tournament/api/pool-tournament.dto';
import { PoolTournamentPlayerDto } from '../../pool-tournament-player/api/pool-tournament-player.dto';

export class PoolTournamentFieldDto {
  constructor(
    public pool_tournament: PoolTournamentDto,
    /**
     * @note timestamp in ISO-8601 format, null if field hasn't been published
     */
    public created_at: string | null,
    public player_tiers: {
      [tier: number]: PoolTournamentPlayerDto[];
    } = {}
  ) {}
}
