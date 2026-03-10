import { DataSource } from 'typeorm';

import { League } from '../../src/league/lib/league.entity';

export async function createLeague(
  ds: DataSource,
  overrides: Partial<League> = {}
): Promise<League> {
  return ds.getRepository(League).save({
    name: `Test League ${Date.now()}`,
    ...overrides,
  });
}
