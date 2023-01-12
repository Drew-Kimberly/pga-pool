import { Repository } from 'typeorm';

import { User } from './user.entity';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Optional()
    private readonly logger: LoggerService = new Logger(UserService.name)
  ) {}

  list(): Promise<User[]> {
    return this.userRepo.find();
  }

  get(id: string): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  upsert(user: User): Promise<User> {
    return this.userRepo.save(user);
  }
}
