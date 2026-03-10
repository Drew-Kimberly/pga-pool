import { DataSource } from 'typeorm';

import { PoolTournamentPlayer } from '../../src/pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolTournamentUser } from '../../src/pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolTournamentUserPick } from '../../src/pool-tournament-user-pick/lib/pool-tournament-user-pick.entity';

import { createPoolTournamentPlayer } from './pool-tournament-player.factory';
import { createPoolTournamentUser } from './pool-tournament-user.factory';

export async function createPoolTournamentUserPick(
  ds: DataSource,
  opts: {
    poolTournamentUser?: PoolTournamentUser;
    poolTournamentPlayer?: PoolTournamentPlayer;
    overrides?: Partial<PoolTournamentUserPick>;
  } = {}
): Promise<PoolTournamentUserPick> {
  const poolTournamentUser =
    opts.poolTournamentUser ?? (await createPoolTournamentUser(ds));
  const poolTournamentPlayer =
    opts.poolTournamentPlayer ?? (await createPoolTournamentPlayer(ds));

  return ds.getRepository(PoolTournamentUserPick).save({
    pool_tournament_user: poolTournamentUser,
    pool_tournament_player: poolTournamentPlayer,
    ...opts.overrides,
  });
}
