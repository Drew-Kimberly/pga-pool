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
        opts.where = { ...opts?.where, pool_id: poolId };
        opts.order = {
          pga_tournament: { start_date: 'ASC' },
        };
      },
    });
  }

  get(
    poolTournamentId: string,
    poolId?: string,
    repo: Repository<PoolTournament> = this.poolTournamentRepo
  ): Promise<PoolTournament | null> {
    return repo.findOne({
      where: {
        id: poolTournamentId,
        ...(poolId ? { pool_id: poolId } : {}),
      },
    });
  }

  upsert(
    poolTournament: PoolTournament,
    repo: Repository<PoolTournament> = this.poolTournamentRepo
  ): Promise<PoolTournament> {
    return repo.save(poolTournament);
  }

  listByPgaTournamentId(pgaTournamentId: string) {
    return this.poolTournamentRepo.find({ where: { pga_tournament_id: pgaTournamentId } });
  }
}
