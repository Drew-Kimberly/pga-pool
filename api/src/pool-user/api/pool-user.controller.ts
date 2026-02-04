import { ControllerBase } from '../../common/api';
import { IListParams, List, ListParams, PaginatedCollection } from '../../common/api/list';
import { FieldFilterSchema } from '../../common/api/list/schema';
import { UUIDValidationPipe } from '../../common/api/validation';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';
import { PoolService } from '../../pool/lib/pool.service';
import { PoolUserService } from '../lib/pool-user.service';

import { PoolUserDto } from './pool-user.dto';

import { Controller, NotFoundException } from '@nestjs/common';

@Controller('pools/:poolId/users')
export class PoolUserController extends ControllerBase {
  constructor(
    private readonly poolUserService: PoolUserService,
    private readonly poolService: PoolService
  ) {
    super();
  }

  @List({
    filter: {
      'user.id': FieldFilterSchema.uuid(),
      'user.name': FieldFilterSchema.string(),
      'user.nickname': FieldFilterSchema.string(),
      pool_score: FieldFilterSchema.numeric(),
    },
  })
  async listPoolUsers(
    @UUIDValidationPipe('poolId') poolId: string,
    @ListParams() params: IListParams
  ): Promise<PaginatedCollection<PoolUserDto>> {
    const pool = await this.poolService.get(poolId);
    if (!pool) {
      throw new NotFoundException(`Pool (ID: ${poolId}) not found`);
    }
    const scoring = pool.settings?.scoring_format;
    const scoreOrder = scoring === PoolScoringFormat.Strokes ? 'ASC' : 'DESC';

    const result = await this.poolUserService.list(
      poolId,
      params,
      {
        'user.id': 'user.id',
        'user.name': 'user.name',
        'user.nickname': 'user.nickname',
      },
      scoreOrder
    );

    return { ...result, data: result.data.map(PoolUserDto.fromEntity) };
  }
}
