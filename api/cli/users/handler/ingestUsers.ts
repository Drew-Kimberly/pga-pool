import { SeedDataService } from '../../../src/seed-data/lib/seed-data.service';
import { User } from '../../../src/user/lib/user.entity';
import { UserService } from '../../../src/user/lib/user.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function ingestUsers() {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const userService = ctx.get(UserService);
  const seedDataService = ctx.get(SeedDataService);
  const logger = new Logger(ingestUsers.name);

  const seedUsers = seedDataService.getSeedData<Record<string, Omit<User, 'id'>>>('users');
  if (!seedUsers) {
    throw new Error(`users seed data file not found!`);
  }

  for (const [id, user] of Object.entries(seedUsers)) {
    await userService.upsert({
      ...user,
      id,
    } as User);

    logger.log(`Successfully ingested user ${id}`);
  }

  await ctx.close();
}
