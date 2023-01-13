import { FindOptionsWhere, Repository } from 'typeorm';

import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PgaTournamentPlayerFilter } from './pga-tournament-player.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaTournamentPlayerService {
  constructor(
    @InjectRepository(PgaTournamentPlayer)
    private readonly tourneyPlayerRepo: Repository<PgaTournamentPlayer>
  ) {}

  list(filter: PgaTournamentPlayerFilter): Promise<PgaTournamentPlayer[]> {
    const findOptions: FindOptionsWhere<PgaTournamentPlayer> = {
      ...(filter.tournamentId ? { pga_tournament: { id: filter.tournamentId } } : {}),
      ...(filter.playerId ? { pga_player: { id: filter.playerId } } : {}),
      ...(filter.year ? { pga_tournament: { year: filter.year } } : {}),
    };

    return this.tourneyPlayerRepo.find({
      where: findOptions,
      relations: ['pga_tournament', 'pga_player'],
      order: {
        pga_tournament: { year: 'DESC', start_date: 'DESC' },
        score_total: 'DESC',
      },
    });
  }

  get(pgaTournamentPlayerId: string): Promise<PgaTournamentPlayer | null> {
    return this.tourneyPlayerRepo.findOneBy({ id: pgaTournamentPlayerId });
  }

  upsert(pgaTournamentPlayer: PgaTournamentPlayer): Promise<PgaTournamentPlayer> {
    return this.tourneyPlayerRepo.save(pgaTournamentPlayer);
  }
}
