import { Repository } from 'typeorm';

import {
  defaultListParams,
  IListParams,
  PaginatedCollection,
  TypeOrmListService,
} from '../../common/api/list';

import { LeagueUser } from './league-user.entity';
import { CreateLeagueUser, UpdateLeagueUser } from './league-user.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LeagueUserService {
  constructor(
    @InjectRepository(LeagueUser)
    private readonly leagueUserRepo: Repository<LeagueUser>,
    private readonly listService: TypeOrmListService<LeagueUser>
  ) {}

  async list(
    params: IListParams = defaultListParams,
    fieldMap: Record<string, string> = {}
  ): Promise<PaginatedCollection<LeagueUser>> {
    return this.listService.list(params, {
      entityType: LeagueUser,
      fieldMap,
      onFindOptions: (opts) => (opts.order = { league_id: 'ASC' }),
    });
  }

  get(id: string): Promise<LeagueUser | null> {
    return this.leagueUserRepo.findOneBy({ id });
  }

  create(payload: CreateLeagueUser): Promise<LeagueUser> {
    return this.leagueUserRepo.save(this.leagueUserRepo.create(payload));
  }

  update(payload: UpdateLeagueUser): Promise<LeagueUser> {
    return this.leagueUserRepo.save(payload);
  }

  delete(id: string) {
    return this.leagueUserRepo.delete(id);
  }
}
