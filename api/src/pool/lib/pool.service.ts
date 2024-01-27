import { Repository } from 'typeorm';

import {
  defaultListParams,
  IListParams,
  PaginatedCollection,
  TypeOrmListService,
} from '../../common/api/list';

import { Pool } from './pool.entity';
import { CreatePool, UpdatePool } from './pool.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolService {
  constructor(
    @InjectRepository(Pool)
    private readonly poolRepo: Repository<Pool>,
    private readonly listService: TypeOrmListService<Pool>
  ) {}

  async list(
    params: IListParams = defaultListParams,
    fieldMap: Record<string, string> = {}
  ): Promise<PaginatedCollection<Pool>> {
    return this.listService.list(params, {
      entityType: Pool,
      fieldMap,
      onFindOptions: (opts) => (opts.order = { year: 'DESC', name: 'ASC' }),
    });
  }

  get(id: string): Promise<Pool | null> {
    return this.poolRepo.findOneBy({ id });
  }

  // TODO - need to start validating payloads at the business logic layer.
  async create(payload: CreatePool): Promise<Pool> {
    const { tournaments, users, ...rest } = payload;

    const pool = await this.poolRepo.save(this.poolRepo.create(rest));
    // TODO: save tournaments and users. Use TX manager.

    return (await this.get(pool.id)) as Pool;
  }

  async update(payload: UpdatePool): Promise<Pool> {
    const { tournaments, users, ...rest } = payload;

    await this.poolRepo.save(rest);
    // TODO: save tournaments and users. Use TX manager.

    return (await this.get(payload.id)) as Pool;
  }

  delete(id: string) {
    return this.poolRepo.delete(id);
  }
}
