import { DataSource } from 'typeorm';

import { League } from '../../src/league/lib/league.entity';
import { PgaTournament } from '../../src/pga-tournament/lib/pga-tournament.entity';
import { Pool } from '../../src/pool/lib/pool.entity';
import { PoolTournament } from '../../src/pool-tournament/lib/pool-tournament.entity';

import { createPgaTournament } from './pga-tournament.factory';
import { createPool } from './pool.factory';

export async function createPoolTournament(
  ds: DataSource,
  opts: {
    pool?: Pool;
    pgaTournament?: PgaTournament;
    league?: League;
    overrides?: Partial<PoolTournament>;
  } = {}
): Promise<PoolTournament> {
  const pool = opts.pool ?? (await createPool(ds));
  const pgaTournament = opts.pgaTournament ?? (await createPgaTournament(ds));
  const league = opts.league ?? pool.league;

  // Use FK IDs only (no entity refs) to avoid OneToOne cascade conflicts
  const repo = ds.getRepository(PoolTournament);
  const saved = await repo.save(
    repo.create({
      pool_id: pool.id,
      pga_tournament_id: pgaTournament.id,
      league_id: league.id,
      scores_are_official: false,
      ...opts.overrides,
    })
  );

  return repo.findOneOrFail({ where: { id: saved.id } });
}
