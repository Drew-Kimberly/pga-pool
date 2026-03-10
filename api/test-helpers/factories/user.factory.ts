import { randomUUID } from 'crypto';

import { DataSource } from 'typeorm';

import { User } from '../../src/user/lib/user.entity';

export async function createUser(
  ds: DataSource,
  overrides: Partial<User> = {}
): Promise<User> {
  const suffix = randomUUID().slice(0, 8);
  return ds.getRepository(User).save({
    name: `Test User ${suffix}`,
    nickname: `user_${suffix}`,
    email: `user-${suffix}@test.com`,
    ...overrides,
  });
}
