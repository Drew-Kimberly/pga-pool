import { DataSource } from 'typeorm';

import { League } from '../../src/league/lib/league.entity';
import { Pool } from '../../src/pool/lib/pool.entity';
import { PoolScoringFormat, PoolType } from '../../src/pool/lib/pool.interface';

import { createLeague } from './league.factory';

export async function createPool(
  ds: DataSource,
  opts: {
    league?: League;
    overrides?: Partial<Pool>;
  } = {}
): Promise<Pool> {
  const league = opts.league ?? (await createLeague(ds));

  return ds.getRepository(Pool).save({
    year: 2026,
    name: `Test Pool ${Date.now()}`,
    type: PoolType.Season,
    settings: { scoring_format: PoolScoringFormat.FedexCuptPoints },
    league,
    league_id: league.id,
    ...opts.overrides,
  });
}
