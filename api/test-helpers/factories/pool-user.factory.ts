import { DataSource } from 'typeorm';

import { League } from '../../src/league/lib/league.entity';
import { Pool } from '../../src/pool/lib/pool.entity';
import { PoolUser } from '../../src/pool-user/lib/pool-user.entity';
import { User } from '../../src/user/lib/user.entity';

import { createPool } from './pool.factory';
import { createUser } from './user.factory';

export async function createPoolUser(
  ds: DataSource,
  opts: {
    pool?: Pool;
    user?: User;
    league?: League;
    overrides?: Partial<PoolUser>;
  } = {}
): Promise<PoolUser> {
  const pool = opts.pool ?? (await createPool(ds));
  const user = opts.user ?? (await createUser(ds));
  const league = opts.league ?? pool.league;

  return ds.getRepository(PoolUser).save({
    pool,
    pool_id: pool.id,
    user,
    user_id: user.id,
    league,
    league_id: league.id,
    pool_score: 0,
    ...opts.overrides,
  });
}
