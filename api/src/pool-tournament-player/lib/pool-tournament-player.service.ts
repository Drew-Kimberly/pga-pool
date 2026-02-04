import { FindOptionsWhere, Repository } from 'typeorm';

import { defaultListParams, IListParams, TypeOrmListService } from '../../common/api/list';

import { PoolTournamentPlayer } from './pool-tournament-player.entity';
import { PoolTournamentPlayerFilter } from './pool-tournament-player.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolTournamentPlayerService {
  constructor(
    @InjectRepository(PoolTournamentPlayer)
    private readonly poolTournamentPlayerRepo: Repository<PoolTournamentPlayer>,
    private readonly listService: TypeOrmListService<PoolTournamentPlayer>
  ) {}

  list(
    filter: PoolTournamentPlayerFilter = {},
    repo: Repository<PoolTournamentPlayer> = this.poolTournamentPlayerRepo
  ): Promise<PoolTournamentPlayer[]> {
    const findOptions: FindOptionsWhere<PoolTournamentPlayer> = {
      ...(filter.tier ? { tier: filter.tier } : {}),
      ...(filter.poolTournamentId ? { pool_tournament: { id: filter.poolTournamentId } } : {}),
      ...(filter.pgaTournamentId
        ? { pga_tournament_player: { pga_tournament: { id: filter.pgaTournamentId } } }
        : {}),
      ...(filter.playerId
        ? { pga_tournament_player: { pga_player: { id: filter.playerId } } }
        : {}),
      ...(filter.year ? { pga_tournament_player: { pga_tournament: { year: filter.year } } } : {}),
    };

    return repo.find({
      where: findOptions,
      relations: ['pga_tournament_player'],
      order: {
        tier: 'ASC',
      },
    });
  }

  listPaginated(
    poolTournamentId: string,
    params: IListParams = defaultListParams,
    fieldMap: Record<string, string> = {}
  ) {
    return this.listService.list(params, {
      entityType: PoolTournamentPlayer,
      fieldMap,
      onFindOptions: (opts) => {
        opts.where = { ...opts?.where, pool_tournament: { id: poolTournamentId } };
        opts.order = {
          pga_tournament_player: {
            score_total: 'ASC',
            pga_player: { name: 'ASC' },
          },
        };
      },
    });
  }

  get(poolTournamentPlayerId: string): Promise<PoolTournamentPlayer | null> {
    return this.poolTournamentPlayerRepo.findOneBy({ id: poolTournamentPlayerId });
  }

  upsert(
    poolTournamentPlayer: PoolTournamentPlayer,
    repo: Repository<PoolTournamentPlayer> = this.poolTournamentPlayerRepo
  ): Promise<PoolTournamentPlayer> {
    return repo.save(poolTournamentPlayer);
  }
}
