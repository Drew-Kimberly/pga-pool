import { ControllerBase } from '../../common/api';
import { IListParams, List, ListParams, PaginatedCollection } from '../../common/api/list';
import { UUIDValidationPipe } from '../../common/api/validation';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';
import { PoolTournamentService } from '../../pool-tournament/lib/pool-tournament.service';
import { PoolTournamentUserService } from '../lib/pool-tournament-user.service';

import { PoolTournamentUserDto } from './pool-tournament-user.dto';

import { Controller, NotFoundException } from '@nestjs/common';

@Controller('pools/:poolId/tournaments/:poolTournamentId/users')
export class PoolTournamentUserController extends ControllerBase {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly poolTournamentUserService: PoolTournamentUserService
  ) {
    super();
  }

  @List()
  async listPoolTournamentUsers(
    @UUIDValidationPipe('poolId') poolId: string,
    @UUIDValidationPipe('poolTournamentId') poolTournamentId: string,
    @ListParams() params: IListParams
  ): Promise<PaginatedCollection<PoolTournamentUserDto>> {
    const poolTournament = await this.poolTournamentService.get(poolTournamentId, poolId);
    if (!poolTournament) {
      throw new NotFoundException(`Pool Tournament (ID: ${poolTournamentId}) not found`);
    }

    const scoring = poolTournament.pool.settings?.scoring_format;
    const scoreOrder = scoring === PoolScoringFormat.Strokes ? 'ASC' : 'DESC';
    const scoreField =
      scoring === PoolScoringFormat.FedexCuptPoints ? 'fedex_cup_points' : 'tournament_score';

    const result = await this.poolTournamentUserService.listPaginated(
      poolTournamentId,
      params,
      scoreOrder,
      scoreField
    );
    return { ...result, data: result.data.map(PoolTournamentUserDto.fromEntity) };
  }
}
