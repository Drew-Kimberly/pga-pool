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
      relations: [
        'picks',
        'picks.pool_tournament_player.pga_tournament_player',
        'pool_tournament',
        'pool_tournament.pga_tournament',
        'user',
      ],
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

  async updateScores(poolTournamentId: string, repo: Repository<PoolUser> = this.poolUserRepo) {
    const updateBatchSize = 25;
    const users = await this.list({ poolTournamentId }, repo);

    for (let i = 0; i < users.length; i += updateBatchSize) {
      const batch = users.slice(i, i + updateBatchSize);
      const updates = batch.map((user) => {
        return this.upsert(
          {
            ...user,
            score: user.picks.reduce<number | null>((total, pick) => {
              return total === null
                ? pick.pool_tournament_player.pga_tournament_player.score_total
                : total + (pick.pool_tournament_player.pga_tournament_player.score_total ?? 0);
            }, null),
          },
          repo
        );
      });

      await Promise.all(updates);
    }
  }
}
