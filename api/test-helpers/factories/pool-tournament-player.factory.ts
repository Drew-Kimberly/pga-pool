import { DataSource } from 'typeorm';

import { PgaTournamentPlayer } from '../../src/pga-tournament-player/lib/pga-tournament-player.entity';
import { PoolTournament } from '../../src/pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentPlayer } from '../../src/pool-tournament-player/lib/pool-tournament-player.entity';

import { createPgaTournamentPlayer } from './pga-tournament-player.factory';
import { createPoolTournament } from './pool-tournament.factory';

export async function createPoolTournamentPlayer(
  ds: DataSource,
  opts: {
    pgaTournamentPlayer?: PgaTournamentPlayer;
    poolTournament?: PoolTournament;
    overrides?: Partial<PoolTournamentPlayer>;
  } = {}
): Promise<PoolTournamentPlayer> {
  const pgaTournamentPlayer =
    opts.pgaTournamentPlayer ?? (await createPgaTournamentPlayer(ds));
  const poolTournament = opts.poolTournament ?? (await createPoolTournament(ds));

  // PoolTournamentPlayer has OneToOne with PgaTournamentPlayer — use entity ref
  // but for pool_tournament (ManyToOne), use entity ref directly
  const repo = ds.getRepository(PoolTournamentPlayer);
  const saved = await repo.save({
    pga_tournament_player: pgaTournamentPlayer,
    pool_tournament: poolTournament,
    tier: 1,
    ...opts.overrides,
  });

  return repo.findOneOrFail({ where: { id: saved.id } });
}
