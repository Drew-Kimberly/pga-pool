import { DataSource } from 'typeorm';

import { League } from '../../src/league/lib/league.entity';
import { PoolTournament } from '../../src/pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentUser } from '../../src/pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolUser } from '../../src/pool-user/lib/pool-user.entity';

import { createPoolTournament } from './pool-tournament.factory';
import { createPoolUser } from './pool-user.factory';

export async function createPoolTournamentUser(
  ds: DataSource,
  opts: {
    poolTournament?: PoolTournament;
    poolUser?: PoolUser;
    league?: League;
    overrides?: Partial<PoolTournamentUser>;
  } = {}
): Promise<PoolTournamentUser> {
  const poolTournament = opts.poolTournament ?? (await createPoolTournament(ds));
  const poolUser = opts.poolUser ?? (await createPoolUser(ds));
  const league = opts.league ?? poolTournament.league;

  return ds.getRepository(PoolTournamentUser).save({
    pool_tournament: poolTournament,
    pool_tournament_id: poolTournament.id,
    pool_user: poolUser,
    pool_user_id: poolUser.id,
    league,
    league_id: league.id,
    tournament_score: null,
    fedex_cup_points: 0,
    ...opts.overrides,
  });
}
