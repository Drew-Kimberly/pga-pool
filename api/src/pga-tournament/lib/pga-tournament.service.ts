import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { PgaTournament } from './pga-tournament.entity';

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

  getCurrent(): Promise<PgaTournament | null> {
    const now = new Date(Date.now()).toDateString();
    return this.pgaTournamentRepo.findOneBy({
      start_date: LessThanOrEqual(now),
      end_date: MoreThanOrEqual(now),
    });
  }

  upsert(pgaTournament: PgaTournament): Promise<PgaTournament> {
    return this.pgaTournamentRepo.save(pgaTournament);
  }
}
