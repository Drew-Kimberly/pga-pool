import { FindOptionsWhere, Repository } from 'typeorm';

import { defaultListParams, IListParams, TypeOrmListService } from '../../common/api/list';
import { PoolTournamentUserPick } from '../../pool-tournament-user-pick/lib/pool-tournament-user-pick.entity';

import { PoolTournamentUser } from './pool-tournament-user.entity';
import { PoolTournamentUserFilter } from './pool-tournament-user.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolTournamentUserService {
  constructor(
    @InjectRepository(PoolTournamentUser)
    private readonly poolTournamentUserRepo: Repository<PoolTournamentUser>,
    private readonly listService: TypeOrmListService<PoolTournamentUser>
  ) {}

  list(
    filter: PoolTournamentUserFilter = {},
    repo: Repository<PoolTournamentUser> = this.poolTournamentUserRepo,
    scoreOrder: 'ASC' | 'DESC' = 'DESC',
    scoreField: 'tournament_score' | 'fedex_cup_points' = 'tournament_score'
  ): Promise<PoolTournamentUser[]> {
    const findOptions: FindOptionsWhere<PoolTournamentUser> = {
      ...(filter.pgaTournamentId
        ? { pool_tournament: { pga_tournament: { id: filter.pgaTournamentId } } }
        : {}),
      ...(filter.poolTournamentId ? { pool_tournament: { id: filter.poolTournamentId } } : {}),
      ...(filter.userId ? { pool_user: { user: { id: filter.userId } } } : {}),
    };

    return repo.find({
      where: findOptions,
      relations: [
        'picks',
        'picks.pool_tournament_player.pga_tournament_player',
        'picks.pool_tournament_player.pga_tournament_player.pga_tournament',
        'pool_user',
        'pool_user.user',
      ],
      order: {
        [scoreField]: scoreOrder,
        picks: {
          pool_tournament_player: {
            tier: 'ASC',
          },
        },
      },
    });
  }

  listPaginated(
    poolTournamentId: string,
    params: IListParams = defaultListParams,
    scoreOrder: 'ASC' | 'DESC' = 'DESC',
    scoreField: 'tournament_score' | 'fedex_cup_points' = 'tournament_score'
  ) {
    return this.listService.list(params, {
      entityType: PoolTournamentUser,
      onFindOptions: (opts) => {
        opts.where = { ...opts?.where, pool_tournament: { id: poolTournamentId } };
        opts.relations = [
          'picks',
          'picks.pool_tournament_player',
          'picks.pool_tournament_player.pga_tournament_player',
          'pool_user',
          'pool_user.user',
        ];
        opts.order = {
          [scoreField]: scoreOrder,
          picks: {
            pool_tournament_player: {
              tier: 'ASC',
            },
          },
        };
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

    for (const user of users) {
      await this.upsert(
        {
          ...user,
          tournament_score: this.aggregateScore(user.picks),
          fedex_cup_points: this.aggregateFedexPoints(user.picks),
        },
        repo
      );
    }
  }

  private aggregateScore(picks: PoolTournamentUserPick[]): number | null {
    return picks.reduce<number | null>((total, pick) => {
      return total === null
        ? pick.pool_tournament_player.pga_tournament_player.score_total
        : total + (pick.pool_tournament_player.pga_tournament_player.score_total ?? 0);
    }, null);
  }

  private aggregateFedexPoints(picks: PoolTournamentUserPick[]): number {
    return picks.reduce<number>((total, pick) => {
      const player = pick.pool_tournament_player.pga_tournament_player;
      const points = pick.pool_tournament_player.pga_tournament_player.pga_tournament
        .official_fedex_cup_points_calculated
        ? player.official_fedex_cup_points!
        : player.projected_fedex_cup_points;

      return total + points;
    }, 0);
  }
}
