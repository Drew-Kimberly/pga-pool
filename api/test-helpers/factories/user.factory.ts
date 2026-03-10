import { randomUUID } from 'crypto';

import { DataSource } from 'typeorm';

import { User } from '../../src/user/lib/user.entity';

let counter = 0;

export async function createUser(
  ds: DataSource,
  overrides: Partial<User> = {}
): Promise<User> {
  counter += 1;
  return ds.getRepository(User).save({
    name: `Test User ${counter}`,
    nickname: `user${counter}`,
    email: `user${counter}-${randomUUID().slice(0, 6)}@test.com`,
    ...overrides,
  });
}
