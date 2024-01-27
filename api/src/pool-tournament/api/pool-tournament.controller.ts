import { ControllerBase } from '../../common/api';
import { IListParams, List, ListParams, PaginatedCollection } from '../../common/api/list';
import { FieldFilterSchema } from '../../common/api/list/schema';
import { UUIDValidationPipe } from '../../common/api/validation';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PoolTournament } from '../lib/pool-tournament.entity';
import { PoolTournamentService } from '../lib/pool-tournament.service';

import { PoolTournamentDto } from './pool-tournament.dto';

import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

export const CURRENT_TOURNAMENT = 'current';

@Controller('pools/:poolId/tournaments')
export class PoolTournamentController extends ControllerBase {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly pgaTournamentService: PgaTournamentService
  ) {
    super();
  }

  @List({
    filter: {
      'pga_tournament.id': FieldFilterSchema.uuid(),
    },
  })
  async listTournaments(
    @UUIDValidationPipe('poolId') poolId: string,
    @ListParams() params: IListParams
  ): Promise<{ data: PoolTournamentDto[] }> {
    let result: PaginatedCollection<PoolTournament>;

    try {
      result = await this.poolTournamentService.list(poolId, params);
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error listing tournaments for pool (ID: ${poolId}): ${e}`);
      throw e;
    }

    return { ...result, data: result.data.map(PoolTournamentDto.fromEntity) };
  }

  @Get('/:poolTournamentId')
  async getTournament(@Param('poolTournamentId') poolTournamentId: string) {
    let poolTournament: PoolTournament | null;

    try {
      poolTournament = await this.poolTournamentService.get(poolTournamentId);
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error fetching pool tournament (ID: ${poolTournamentId}): ${e}`);
      throw e;
    }

    if (!poolTournament) {
      throw new NotFoundException(`Pool Tournament (ID: ${poolTournamentId}) not found`);
    }

    return PoolTournamentDto.fromEntity(poolTournament);
  }
}
