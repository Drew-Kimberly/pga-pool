import { Repository } from 'typeorm';

import { PoolUserPick } from './pool-user-pick.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolUserPickService {
  constructor(
    @InjectRepository(PoolUserPick)
    private readonly poolUserPickRepo: Repository<PoolUserPick>
  ) {}

  list(): Promise<PoolUserPick[]> {
    return this.poolUserPickRepo.find();
  }

  get(poolUserPickId: string): Promise<PoolUserPick | null> {
    return this.poolUserPickRepo.findOneBy({ id: poolUserPickId });
  }

  upsert(poolUserPick: PoolUserPick): Promise<PoolUserPick> {
    return this.poolUserPickRepo.save(poolUserPick);
  }
}
