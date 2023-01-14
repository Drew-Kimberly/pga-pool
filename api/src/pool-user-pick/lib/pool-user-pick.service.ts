import { FindOptionsWhere, Repository } from 'typeorm';

import { PoolUserPick } from './pool-user-pick.entity';
import { PoolUserPickFilter } from './pool-user-pick.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolUserPickService {
  constructor(
    @InjectRepository(PoolUserPick)
    private readonly poolUserPickRepo: Repository<PoolUserPick>
  ) {}

  list(
    filter: PoolUserPickFilter = {},
    repo: Repository<PoolUserPick> = this.poolUserPickRepo
  ): Promise<PoolUserPick[]> {
    const findOptions: FindOptionsWhere<PoolUserPick> = {
      ...(filter.poolUserId ? { pool_user: { id: filter.poolUserId } } : {}),
      ...(filter.poolTournamentId
        ? { pool_tournament_player: { pool_tournament: { id: filter.poolTournamentId } } }
        : {}),
    };

    return repo.find({
      where: findOptions,
      relations: [
        'pool_user',
        'pool_tournament_player',
        'pool_tournament_player.pool_tournament',
        'pool_tournament_player.pool_tournament.pga_tournament',
        'pool_tournament_player.pga_tournament_player',
      ],
      order: {
        pool_tournament_player: {
          pool_tournament: { pga_tournament: { year: 'DESC', start_date: 'DESC' } },
          pga_tournament_player: { score_total: 'ASC' },
        },
      },
    });
  }

  get(
    poolUserPickId: string,
    repo: Repository<PoolUserPick> = this.poolUserPickRepo
  ): Promise<PoolUserPick | null> {
    return repo.findOneBy({ id: poolUserPickId });
  }

  upsert(
    poolUserPick: PoolUserPick,
    repo: Repository<PoolUserPick> = this.poolUserPickRepo
  ): Promise<PoolUserPick> {
    return repo.save(poolUserPick);
  }
}
