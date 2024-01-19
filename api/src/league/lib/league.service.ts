import { Repository } from 'typeorm';

import {
  defaultListParams,
  IListParams,
  PaginatedCollection,
  TypeOrmListService,
} from '../../common/api/list';

import { League } from './league.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepo: Repository<League>,
    private readonly listService: TypeOrmListService<League>
  ) {}

  async list(
    params: IListParams = defaultListParams,
    fieldMap: Record<string, string> = {}
  ): Promise<PaginatedCollection<League>> {
    return this.listService.list(params, {
      entityType: League,
      fieldMap,
      onFindOptions: (opts) => (opts.order = { name: 'ASC' }),
    });
  }

  get(id: string): Promise<League | null> {
    return this.leagueRepo.findOneBy({ id });
  }

  create(payload: Pick<League, 'name'>): Promise<League> {
    return this.leagueRepo.save(this.leagueRepo.create(payload));
  }

  update(league: Pick<League, 'id' | 'name'>): Promise<League> {
    return this.leagueRepo.save(league);
  }

  delete(id: string) {
    return this.leagueRepo.delete(id);
  }
}
