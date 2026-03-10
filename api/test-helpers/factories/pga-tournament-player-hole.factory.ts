import { DataSource } from 'typeorm';

import { PgaTournamentPlayerHole } from '../../src/pga-tournament-player-hole/lib/pga-tournament-player-hole.entity';
import { HoleScoreStatus } from '../../src/pga-tournament-player-hole/lib/pga-tournament-player-hole.interface';
import { PgaTournamentPlayer } from '../../src/pga-tournament-player/lib/pga-tournament-player.entity';

import { createPgaTournamentPlayer } from './pga-tournament-player.factory';

export async function createPgaTournamentPlayerHole(
  ds: DataSource,
  opts: {
    pgaTournamentPlayer?: PgaTournamentPlayer;
    overrides?: Partial<PgaTournamentPlayerHole>;
  } = {}
): Promise<PgaTournamentPlayerHole> {
  const pgaTournamentPlayer =
    opts.pgaTournamentPlayer ?? (await createPgaTournamentPlayer(ds));

  return ds.getRepository(PgaTournamentPlayerHole).save({
    pga_tournament_player_id: pgaTournamentPlayer.id,
    round_number: 1,
    hole_number: 1,
    par: 4,
    score: 4,
    to_par: 0,
    status: HoleScoreStatus.Par,
    yardage: 420,
    sequence: 1,
    ...opts.overrides,
  });
}
