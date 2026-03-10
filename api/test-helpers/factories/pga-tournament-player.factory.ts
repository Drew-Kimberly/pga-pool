import { DataSource } from 'typeorm';

import { PgaPlayer } from '../../src/pga-player/lib/pga-player.entity';
import { PgaTournament } from '../../src/pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentPlayer } from '../../src/pga-tournament-player/lib/pga-tournament-player.entity';
import { PlayerStatus } from '../../src/pga-tournament-player/lib/pga-tournament-player.interface';

import { createPgaPlayer } from './pga-player.factory';
import { createPgaTournament } from './pga-tournament.factory';

export async function createPgaTournamentPlayer(
  ds: DataSource,
  opts: {
    pgaPlayer?: PgaPlayer;
    pgaTournament?: PgaTournament;
    overrides?: Partial<PgaTournamentPlayer>;
  } = {}
): Promise<PgaTournamentPlayer> {
  const pgaPlayer = opts.pgaPlayer ?? (await createPgaPlayer(ds));
  const pgaTournament = opts.pgaTournament ?? (await createPgaTournament(ds));
  const id = `${pgaPlayer.id}-${pgaTournament.id}`;

  return ds.getRepository(PgaTournamentPlayer).save({
    id,
    pga_player: pgaPlayer,
    pga_tournament: pgaTournament,
    active: true,
    status: PlayerStatus.Active,
    is_round_complete: false,
    current_round: pgaTournament.current_round,
    starting_hole: 1,
    score_total: null,
    score_thru: null,
    current_position: null,
    projected_fedex_cup_points: 0,
    ...opts.overrides,
  });
}
