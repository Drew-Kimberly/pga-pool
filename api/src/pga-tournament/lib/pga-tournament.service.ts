import { Repository } from 'typeorm';

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

  upsert(pgaTournament: PgaTournament): Promise<PgaTournament> {
    return this.pgaTournamentRepo.save(pgaTournament);
  }
}
