import { Repository } from 'typeorm';

import { PoolTournament } from './pool-tournament.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolTournamentService {
  constructor(
    @InjectRepository(PoolTournament)
    private readonly poolTournamentRepo: Repository<PoolTournament>
  ) {}

  list(): Promise<PoolTournament[]> {
    return this.poolTournamentRepo.find();
  }

  get(poolTournamentId: string): Promise<PoolTournament | null> {
    return this.poolTournamentRepo.findOneBy({ id: poolTournamentId });
  }

  upsert(poolTournament: PoolTournament): Promise<PoolTournament> {
    return this.poolTournamentRepo.save(poolTournament);
  }
}
