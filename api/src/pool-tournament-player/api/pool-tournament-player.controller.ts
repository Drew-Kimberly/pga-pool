import { ControllerBase } from '../../common/api';
import { IListParams, List, ListParams, PaginatedCollection } from '../../common/api/list';
import { FieldFilterSchema } from '../../common/api/list/schema';
import { UUIDValidationPipe } from '../../common/api/validation';
import { PlayerStatus } from '../../pga-tournament-player/lib/pga-tournament-player.interface';
import { PoolTournamentService } from '../../pool-tournament/lib/pool-tournament.service';
import { PoolTournamentPlayerService } from '../lib/pool-tournament-player.service';

import { PoolTournamentPlayerDto } from './pool-tournament-player.dto';

import { Controller, NotFoundException } from '@nestjs/common';

@Controller('pools/:poolId/tournaments/:poolTournamentId/players')
export class PoolTournamentPlayerController extends ControllerBase {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly poolTournamentPlayerService: PoolTournamentPlayerService
  ) {
    super();
  }

  @List({
    filter: {
      tier: FieldFilterSchema.numeric(),
      pga_player_id: FieldFilterSchema.numeric(),
      status: FieldFilterSchema.enum(PlayerStatus),
      active: FieldFilterSchema.boolean(),
    },
  })
  async listPlayers(
    @UUIDValidationPipe('poolId') poolId: string,
    @UUIDValidationPipe('poolTournamentId') poolTournamentId: string,
    @ListParams() params: IListParams
  ): Promise<PaginatedCollection<PoolTournamentPlayerDto>> {
    const poolTournament = await this.poolTournamentService.get(poolTournamentId, poolId);
    if (!poolTournament) {
      throw new NotFoundException(`Pool Tournament (ID: ${poolTournamentId}) not found`);
    }

    const result = await this.poolTournamentPlayerService.listPaginated(poolTournamentId, params, {
      pga_player_id: 'pga_tournament_player.pga_player.id',
      status: 'pga_tournament_player.status',
      active: 'pga_tournament_player.active',
    });

    return { ...result, data: result.data.map(PoolTournamentPlayerDto.fromEntity) };
  }
}
