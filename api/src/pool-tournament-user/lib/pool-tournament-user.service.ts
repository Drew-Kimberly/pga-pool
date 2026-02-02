import { FindOptionsWhere, Repository } from 'typeorm';

import { PoolTournamentUserPick } from '../../pool-tournament-user-pick/lib/pool-tournament-user-pick.entity';

import { PoolTournamentUser } from './pool-tournament-user.entity';
import { PoolTournamentUserFilter } from './pool-tournament-user.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolTournamentUserService {
  constructor(
    @InjectRepository(PoolTournamentUser)
    private readonly poolTournamentUserRepo: Repository<PoolTournamentUser>
  ) {}

  list(
    filter: PoolTournamentUserFilter = {},
    repo: Repository<PoolTournamentUser> = this.poolTournamentUserRepo
  ): Promise<PoolTournamentUser[]> {
    const findOptions: FindOptionsWhere<PoolTournamentUser> = {
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
        'picks.pool_tournament_player.pga_tournament_player.pga_tournament',
        'user',
      ],
      order: {
        picks: {
          pool_tournament_player: {
            pga_tournament_player: { pga_tournament: { year: 'DESC', start_date: 'DESC' } },
          },
        },
        tournament_score: 'ASC',
      },
    });
  }

  get(id: string): Promise<PoolTournamentUser | null> {
    return this.poolTournamentUserRepo.findOneBy({ id });
  }

  upsert(
    payload: PoolTournamentUser,
    repo: Repository<PoolTournamentUser> = this.poolTournamentUserRepo
  ): Promise<PoolTournamentUser> {
    return repo.save(payload);
  }

  async updateScores(
    poolTournamentId: string,
    repo: Repository<PoolTournamentUser> = this.poolTournamentUserRepo
  ) {
    const updateBatchSize = 25;
    const users = await this.list({ poolTournamentId }, repo);

    for (let i = 0; i < users.length; i += updateBatchSize) {
      const batch = users.slice(i, i + updateBatchSize);
      const updates = batch.map((user) => {
        return this.upsert(
          {
            ...user,
            tournament_score: this.aggregateScore(user.picks),
            projected_fedex_cup_points: this.aggregateProjectedFedexPoints(user.picks),
          },
          repo
        );
      });

      await Promise.all(updates);
    }
  }

  private aggregateScore(picks: PoolTournamentUserPick[]): number | null {
    return picks.reduce<number | null>((total, pick) => {
      return total === null
        ? pick.pool_tournament_player.pga_tournament_player.score_total
        : total + (pick.pool_tournament_player.pga_tournament_player.score_total ?? 0);
    }, null);
  }

  private aggregateProjectedFedexPoints(picks: PoolTournamentUserPick[]): number {
    return picks.reduce<number>((total, pick) => {
      const player = pick.pool_tournament_player.pga_tournament_player;
      const points = player.official_fedex_cup_points ?? player.projected_fedex_cup_points;
      return total + points;
    }, 0);
  }
}
