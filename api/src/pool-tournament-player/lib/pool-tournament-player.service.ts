import { FindOptionsWhere, Repository } from 'typeorm';

import { PoolTournamentPlayer } from './pool-tournament-player.entity';
import { PoolTournamentPlayerFilter } from './pool-tournament-player.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolTournamentPlayerService {
  constructor(
    @InjectRepository(PoolTournamentPlayer)
    private readonly poolTournamentPlayerRepo: Repository<PoolTournamentPlayer>
  ) {}

  list(filter: PoolTournamentPlayerFilter): Promise<PoolTournamentPlayer[]> {
    const findOptions: FindOptionsWhere<PoolTournamentPlayer> = {
      ...(filter.tier ? { tier: filter.tier } : {}),
      ...(filter.tournamentId
        ? { pga_tournament_player: { pga_tournament: { id: filter.tournamentId } } }
        : {}),
      ...(filter.playerId
        ? { pga_tournament_player: { pga_player: { id: filter.playerId } } }
        : {}),
      ...(filter.year ? { pga_tournament_player: { pga_tournament: { year: filter.year } } } : {}),
    };

    return this.poolTournamentPlayerRepo.find({
      where: findOptions,
      relations: ['pga_tournament_player'],
      order: {
        pga_tournament_player: {
          pga_tournament: { year: 'DESC', start_date: 'DESC' },
          score_total: 'DESC',
        },
        tier: 'ASC',
      },
    });
  }

  get(poolTournamentPlayerId: string): Promise<PoolTournamentPlayer | null> {
    return this.poolTournamentPlayerRepo.findOneBy({ id: poolTournamentPlayerId });
  }

  upsert(poolTournamentPlayer: PoolTournamentPlayer): Promise<PoolTournamentPlayer> {
    return this.poolTournamentPlayerRepo.save(poolTournamentPlayer);
  }
}
