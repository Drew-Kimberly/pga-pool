import { FindOptionsWhere, Repository } from 'typeorm';

import { PoolUser } from './pool-user.entity';
import { PoolUserFilter } from './pool-user.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolUserService {
  constructor(
    @InjectRepository(PoolUser)
    private readonly poolUserRepo: Repository<PoolUser>
  ) {}

  list(
    filter: PoolUserFilter = {},
    repo: Repository<PoolUser> = this.poolUserRepo
  ): Promise<PoolUser[]> {
    const findOptions: FindOptionsWhere<PoolUser> = {
      ...(filter.pgaTournamentId
        ? { pool_tournament: { pga_tournament: { id: filter.pgaTournamentId } } }
        : {}),
      ...(filter.poolTournamentId ? { pool_tournament: { id: filter.poolTournamentId } } : {}),
      ...(filter.userId ? { user: { id: filter.userId } } : {}),
    };

    return repo.find({
      where: findOptions,
      relations: ['picks', 'pool_tournament', 'pool_tournament.pga_tournament', 'user'],
      order: {
        pool_tournament: { pga_tournament: { year: 'DESC', start_date: 'DESC' } },
        score: 'ASC',
      },
    });
  }

  get(poolUserId: string): Promise<PoolUser | null> {
    return this.poolUserRepo.findOneBy({ id: poolUserId });
  }

  upsert(poolUser: PoolUser, repo: Repository<PoolUser> = this.poolUserRepo): Promise<PoolUser> {
    return repo.save(poolUser);
  }
}
