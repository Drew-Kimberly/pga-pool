import { SeedDataService } from 'src/seed-data/lib/seed-data.service';

import { User } from './user.interface';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    private readonly seedData: SeedDataService,
    @Optional()
    private readonly logger: LoggerService = new Logger(UserService.name)
  ) {}

  listUsers(): User[] {
    return Object.entries(this.getSeedUsers()).map(([id, user]) => ({
      ...user,
      id,
    }));
  }

  getUser(id: string): User | undefined {
    return this.getSeedUsers()[id];
  }

  private getSeedUsers(): Record<string, User> | never {
    const users = this.seedData.getSeedData<Record<string, User>>('users');
    if (!users) {
      throw new Error('No seed user data found!');
    }

    return users;
  }
}
