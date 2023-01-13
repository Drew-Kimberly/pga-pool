import { Repository } from 'typeorm';

import { PoolUser } from './pool-user.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PoolUserService {
  constructor(
    @InjectRepository(PoolUser)
    private readonly poolUserRepo: Repository<PoolUser>
  ) {}

  list(): Promise<PoolUser[]> {
    return this.poolUserRepo.find();
  }

  get(poolUserId: string): Promise<PoolUser | null> {
    return this.poolUserRepo.findOneBy({ id: poolUserId });
  }

  upsert(poolUser: PoolUser): Promise<PoolUser> {
    return this.poolUserRepo.save(poolUser);
  }
}
