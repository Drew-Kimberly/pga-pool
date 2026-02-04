import { ControllerBase } from '../../common/api';
import { IListParams, List, ListParams } from '../../common/api/list';
import { FieldFilterSchema } from '../../common/api/list/schema';
import { UUIDValidationPipe } from '../../common/api/validation';
import { PoolDto } from '../lib/pool.dto';
import { PoolService } from '../lib/pool.service';

import { Controller, Get, NotFoundException } from '@nestjs/common';

@Controller('pools')
export class PoolController extends ControllerBase {
  constructor(private readonly poolService: PoolService) {
    super();
  }

  @List({
    filter: {
      year: FieldFilterSchema.numeric(),
      type: FieldFilterSchema.string(),
      name: FieldFilterSchema.string(),
    },
  })
  async listPools(@ListParams() params: IListParams): Promise<{ data: PoolDto[] }> {
    const result = await this.poolService.list(params);
    return { ...result, data: result.data.map(PoolDto.fromEntity) };
  }

  @Get('/:poolId')
  async getPool(@UUIDValidationPipe('poolId') poolId: string) {
    const pool = await this.poolService.get(poolId);
    if (!pool) {
      throw new NotFoundException(`Pool (ID: ${poolId}) not found`);
    }
    return PoolDto.fromEntity(pool);
  }
}
