import { DataSource } from 'typeorm';

import { PgaPlayer } from '../../src/pga-player/lib/pga-player.entity';

export async function createPgaPlayer(
  ds: DataSource,
  overrides: Partial<PgaPlayer> = {}
): Promise<PgaPlayer> {
  // Use random ID in a high range to avoid collisions with seed data
  const id = overrides.id ?? Math.floor(Math.random() * 900000) + 100000;

  return ds.getRepository(PgaPlayer).save({
    id,
    name: `Test Player ${id}`,
    short_name: `T. Player${id}`,
    first_name: `Test`,
    last_name: `Player${id}`,
    active: true,
    ...overrides,
  });
}
