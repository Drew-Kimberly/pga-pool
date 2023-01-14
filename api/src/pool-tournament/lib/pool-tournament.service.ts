import { FindOptionsWhere, Repository } from 'typeorm';

import { PoolTournament } from './pool-tournament.entity';
import { PoolTournamentFilter } from './pool-tournament.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolTournamentService {
  constructor(
    @InjectRepository(PoolTournament)
    private readonly poolTournamentRepo: Repository<PoolTournament>
  ) {}

  list(
    filter: PoolTournamentFilter = {},
    repo: Repository<PoolTournament> = this.poolTournamentRepo
  ): Promise<PoolTournament[]> {
    const findOptions: FindOptionsWhere<PoolTournament> = {
      ...(filter.pgaTournamentId ? { pga_tournament: { id: filter.pgaTournamentId } } : {}),
      ...(filter.year ? { pga_tournament: { year: filter.year } } : {}),
      ...(typeof filter.active === 'boolean' ? { active: filter.active } : {}),
    };

    return repo.find({
      where: findOptions,
      relations: [
        'pga_tournament',
        'pool_users',
        'pool_users.picks',
        'pool_users.picks.pool_tournament_player',
        'pool_users.picks.pool_tournament_player.pga_tournament_player.pga_player',
        'pool_users.picks.pool_tournament_player.pga_tournament_player.pga_tournament',
      ],
      order: {
        pga_tournament: { year: 'DESC', start_date: 'DESC' },
        pool_users: { score: 'ASC', picks: { pool_tournament_player: { tier: 'ASC' } } },
      },
    });
  }

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
