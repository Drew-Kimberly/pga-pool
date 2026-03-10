import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createPgaPlayer } from '../../../test-helpers/factories';
import { MockPgaTourApiService, setupTestApp } from '../../../test-helpers/setup-test-app';
import { PgaApiPlayer } from '../../pga-tour-api/lib/v2/pga-tour-api.interface';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';

import { PgaPlayer } from './pga-player.entity';
import { PgaPlayerIngestor } from './pga-player.ingest';

import { INestApplication } from '@nestjs/common';

function makeApiPlayer(overrides: Partial<PgaApiPlayer> = {}): PgaApiPlayer {
  const id = overrides.id ?? String(Math.floor(Math.random() * 900000) + 100000);
  return {
    id,
    isActive: true,
    firstName: 'Test',
    lastName: `Player${id}`,
    shortName: `T. Player${id}`,
    displayName: `Test Player ${id}`,
    country: 'United States',
    countryFlag: 'USA',
    headshot: `https://pga-tour-res.cloudinary.com/image/upload/headshots_${id}.png`,
    alphaSort: `Player${id}, Test`,
    ...overrides,
  };
}

describe('PgaPlayerIngestor (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let ingestor: PgaPlayerIngestor;
  let mockPgaTourApi: MockPgaTourApiService;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    ingestor = moduleRef.get(PgaPlayerIngestor);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('creates new players from API response', async () => {
    const playerId = Math.floor(Math.random() * 900000) + 100000;
    const apiPlayer = makeApiPlayer({
      id: String(playerId),
      firstName: 'Scottie',
      lastName: 'Scheffler',
      shortName: 'S. Scheffler',
      displayName: 'Scottie Scheffler',
      country: 'United States',
      countryFlag: 'USA',
      headshot: 'https://example.com/headshot.png',
    });

    mockPgaTourApi.getPlayers.mockResolvedValueOnce([apiPlayer]);

    await ingestor.ingest();

    const player = await ds.getRepository(PgaPlayer).findOneBy({ id: playerId });
    expect(player).not.toBeNull();
    expect(player?.name).toBe('Scottie Scheffler');
    expect(player?.short_name).toBe('S. Scheffler');
    expect(player?.first_name).toBe('Scottie');
    expect(player?.last_name).toBe('Scheffler');
    expect(player?.active).toBe(true);
    expect(player?.country).toBe('United States');
    expect(player?.country_flag).toBe('USA');
    expect(player?.headshot_url).toBe('https://example.com/headshot.png');
  });

  it('upserts existing players on re-ingest', async () => {
    const player = await createPgaPlayer(ds, {
      name: 'Old Name',
      country: 'Canada',
    });

    const apiPlayer = makeApiPlayer({
      id: String(player.id),
      displayName: 'Updated Name',
      country: 'United States',
      countryFlag: 'USA',
    });

    mockPgaTourApi.getPlayers.mockResolvedValueOnce([apiPlayer]);

    await ingestor.ingest();

    const updated = await ds.getRepository(PgaPlayer).findOneBy({ id: player.id });
    expect(updated?.name).toBe('Updated Name');
    expect(updated?.country).toBe('United States');
  });

  it('maps null headshot and country fields correctly', async () => {
    const playerId = Math.floor(Math.random() * 900000) + 100000;
    const apiPlayer = makeApiPlayer({
      id: String(playerId),
      headshot: undefined as unknown as string,
      country: undefined as unknown as string,
      countryFlag: undefined as unknown as string,
    });

    mockPgaTourApi.getPlayers.mockResolvedValueOnce([apiPlayer]);

    await ingestor.ingest();

    const player = await ds.getRepository(PgaPlayer).findOneBy({ id: playerId });
    expect(player).not.toBeNull();
    // The ?? null coercion in the ingestor maps undefined → null
    expect(player?.headshot_url).toBeNull();
    expect(player?.country).toBeNull();
    expect(player?.country_flag).toBeNull();
  });

  it('ingests multiple players in a single batch', async () => {
    const id1 = Math.floor(Math.random() * 900000) + 100000;
    const id2 = id1 + 1;

    mockPgaTourApi.getPlayers.mockResolvedValueOnce([
      makeApiPlayer({ id: String(id1), displayName: 'Player One' }),
      makeApiPlayer({ id: String(id2), displayName: 'Player Two' }),
    ]);

    const result = await ingestor.ingest();

    expect(result).toHaveLength(2);

    const p1 = await ds.getRepository(PgaPlayer).findOneBy({ id: id1 });
    const p2 = await ds.getRepository(PgaPlayer).findOneBy({ id: id2 });
    expect(p1?.name).toBe('Player One');
    expect(p2?.name).toBe('Player Two');
  });

  it('marks inactive players correctly', async () => {
    const playerId = Math.floor(Math.random() * 900000) + 100000;
    const apiPlayer = makeApiPlayer({
      id: String(playerId),
      isActive: false,
    });

    mockPgaTourApi.getPlayers.mockResolvedValueOnce([apiPlayer]);

    await ingestor.ingest();

    const player = await ds.getRepository(PgaPlayer).findOneBy({ id: playerId });
    expect(player?.active).toBe(false);
  });
});
