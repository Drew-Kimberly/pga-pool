import { Repository } from 'typeorm';

import { defaultListParams, IListParams, TypeOrmListService } from '../../common/api/list';

import { PoolTournament } from './pool-tournament.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolTournamentService {
  constructor(
    @InjectRepository(PoolTournament)
    private readonly poolTournamentRepo: Repository<PoolTournament>,
    private readonly listService: TypeOrmListService<PoolTournament>
  ) {}

  list(
    poolId: string,
    params: IListParams = defaultListParams,
    fieldMap: Record<string, string> = {}
  ) {
    return this.listService.list(params, {
      entityType: PoolTournament,
      fieldMap,
      onFindOptions: (opts) => {
        opts.where = { ...opts?.where, id: poolId };
        opts.order = {
          pga_tournament: { year: 'DESC', start_date: 'DESC' },
          pool_tournament_users: {
            tournament_score: 'ASC',
            picks: { pool_tournament_player: { tier: 'ASC' } },
          },
        };
      },
    });
  }

  // listOld(
  //   filter: PoolTournamentFilter = {},
  //   repo: Repository<PoolTournament> = this.poolTournamentRepo
  // ): Promise<PoolTournament[]> {
  //   const findOptions: FindOptionsWhere<PoolTournament> = {
  //     ...(filter.pgaTournamentId ? { pga_tournament: { id: filter.pgaTournamentId } } : {}),
  //     ...(filter.year ? { pga_tournament: { year: filter.year } } : {}),
  //     ...(typeof filter.active === 'boolean' ? { active: filter.active } : {}),
  //   };

  //   return repo.find({
  //     where: findOptions,
  //     relations: [
  //       'pga_tournament',
  //       'pool',
  //       'pool_tournament_users',
  //       'pool_tournament_users.picks',
  //       'pool_tournament_users.picks.pool_tournament_player',
  //       'pool_tournament_users.pool_tournament_player.pga_tournament_player.pga_player',
  //       'pool_tournament_users.picks.pool_tournament_player.pga_tournament_player.pga_tournament',
  //     ],
  //     order: {
  //       pga_tournament: { year: 'DESC', start_date: 'DESC' },
  //       pool_tournament_users: {
  //         tournament_score: 'ASC',
  //         picks: { pool_tournament_player: { tier: 'ASC' } },
  //       },
  //     },
  //   });
  // }

  get(
    poolTournamentId: string,
    repo: Repository<PoolTournament> = this.poolTournamentRepo
  ): Promise<PoolTournament | null> {
    return repo.findOne({
      where: { id: poolTournamentId },
      relations: [
        'pool_users',
        'pool_users.picks',
        'pool_users.picks.pool_tournament_player',
        'pool_users.picks.pool_tournament_player.pga_tournament_player',
      ],
    });
  }

  upsert(
    poolTournament: PoolTournament,
    repo: Repository<PoolTournament> = this.poolTournamentRepo
  ): Promise<PoolTournament> {
    return repo.save(poolTournament);
  }
}
