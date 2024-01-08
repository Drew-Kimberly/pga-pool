import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { PgaTournament } from './pga-tournament.entity';
import { SavePgaTournament } from './pga-tournament.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaTournamentService {
  constructor(
    @InjectRepository(PgaTournament)
    private readonly pgaTournamentRepo: Repository<PgaTournament>
  ) {}

  list(): Promise<PgaTournament[]> {
    return this.pgaTournamentRepo.find();
  }

  get(pgaTournamentId: string): Promise<PgaTournament | null> {
    return this.pgaTournamentRepo.findOneBy({ id: pgaTournamentId });
  }

  async getCurrent(pgaTournamentId?: string): Promise<PgaTournament | null> {
    const now = new Date(Date.now());

    return this.pgaTournamentRepo.findOneBy({
      start_date: LessThanOrEqual(now),
      end_date: MoreThanOrEqual(now),
      ...(pgaTournamentId ? { id: pgaTournamentId } : {}),
    });
  }

  save(payload: SavePgaTournament[]): Promise<PgaTournament[]> {
    return this.pgaTournamentRepo.save(payload);
  }
}
