import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

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

  /**
   * Recalculates tournament_score and fedex_cup_points for every
   * pool_tournament_user in a pool tournament with a single set-based UPDATE
   * that joins through picks → pool_tournament_player → pga_tournament_player.
   *
   * FedEx points resolve to the official points once the tournament has
   * calculated them, otherwise the projected points. Emits nothing — callers
   * decide whether a follow-up recompute/finalization event is warranted, which
   * keeps this reusable inside a finalization transaction without self-racing.
   *
   * @param manager pass a transaction's EntityManager to run inside it;
   *   defaults to the repository's manager for standalone calls.
   * @returns the number of pool_tournament_user rows updated.
   */
  async recomputeScores(
    poolTournamentId: string,
    manager: EntityManager = this.poolTournamentUserRepo.manager
  ): Promise<number> {
    // Note: pool_tournament_user_pick has a typo in the FK column: "pool_tournamnet_user_id"
    // Also note: pool_tournament_player FK to pga_tournament_player is column "pga_tournament_player" (not _id suffix)
    const result = await manager.query(
      `
      UPDATE pool_tournament_user ptu
      SET
        tournament_score = sub.total_score,
        fedex_cup_points = sub.total_fedex
      FROM (
        SELECT
          ptup.pool_tournamnet_user_id AS user_id,
          SUM(ptp.score_total)::int AS total_score,
          COALESCE(SUM(
            CASE
              WHEN pgat.official_fedex_cup_points_calculated
                THEN ptp.official_fedex_cup_points
              ELSE ptp.projected_fedex_cup_points
            END
          ), 0) AS total_fedex
        FROM pool_tournament_user_pick ptup
        JOIN pool_tournament_player ptpl ON ptup.pool_tournament_player_id = ptpl.id
        JOIN pga_tournament_player ptp ON ptpl.pga_tournament_player = ptp.id
        JOIN pga_tournament pgat ON ptp.pga_tournament = pgat.id
        WHERE ptup.pool_tournamnet_user_id IN (
          SELECT id FROM pool_tournament_user WHERE pool_tournament_id = $1
        )
        GROUP BY ptup.pool_tournamnet_user_id
      ) sub
      WHERE ptu.id = sub.user_id
      `,
      [poolTournamentId]
    );

    return Array.isArray(result) ? (result[1] ?? 0) : 0;
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
