import { FindOptionsWhere, Repository } from 'typeorm';

import { PoolTournamentUserPick } from './pool-tournament-user-pick.entity';
import { PoolTournamentUserPickFilter } from './pool-tournament-user-pick.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolTournamentUserPickService {
  constructor(
    @InjectRepository(PoolTournamentUserPick)
    private readonly poolTourneyUserPickRepo: Repository<PoolTournamentUserPick>
  ) {}

  list(
    filter: PoolTournamentUserPickFilter = {},
    repo: Repository<PoolTournamentUserPick> = this.poolTourneyUserPickRepo
  ): Promise<PoolTournamentUserPick[]> {
    const findOptions: FindOptionsWhere<PoolTournamentUserPick> = {
      ...(filter.poolTournamentUserId
        ? { pool_tournament_user_id: filter.poolTournamentUserId }
        : {}),
      ...(filter.poolTournamentId ? { pool_tournament_player_id: filter.poolTournamentId } : {}),
    };

    return repo.find({
      where: findOptions,
      relations: [
        'pool_tournament_user',
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
    id: string,
    repo: Repository<PoolTournamentUserPick> = this.poolTourneyUserPickRepo
  ): Promise<PoolTournamentUserPick | null> {
    return repo.findOneBy({ id });
  }

  upsert(
    payload: PoolTournamentUserPick,
    repo: Repository<PoolTournamentUserPick> = this.poolTourneyUserPickRepo
  ): Promise<PoolTournamentUserPick> {
    return repo.save(payload);
  }
}
