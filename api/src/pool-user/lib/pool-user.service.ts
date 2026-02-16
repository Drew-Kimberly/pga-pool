import { Repository } from 'typeorm';

import { defaultListParams, IListParams, TypeOrmListService } from '../../common/api/list';

import { PoolUser } from './pool-user.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolUserService {
  constructor(
    @InjectRepository(PoolUser)
    private readonly poolUserRepo: Repository<PoolUser>,
    private readonly listService: TypeOrmListService<PoolUser>
  ) {}

  list(
    poolId: string,
    params: IListParams = defaultListParams,
    fieldMap: Record<string, string> = {},
    scoreOrder: 'ASC' | 'DESC' = 'DESC'
  ) {
    return this.listService.list(params, {
      entityType: PoolUser,
      fieldMap,
      onFindOptions: (opts) => {
        opts.where = { ...opts?.where, pool_id: poolId };
        opts.order = {
          pool_score: scoreOrder,
          user: {
            nickname: 'ASC',
            name: 'ASC',
            id: 'ASC',
          },
          id: 'ASC',
        };
      },
    });
  }

  get(id: string): Promise<PoolUser | null> {
    return this.poolUserRepo.findOneBy({ id });
  }
}
