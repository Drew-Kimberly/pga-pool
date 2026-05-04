import request from 'supertest';
import { DataSource } from 'typeorm';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  createPgaTournament,
  createPool,
  createPoolTournament,
} from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';

import { INestApplication } from '@nestjs/common';

describe('WeeklyPoolTournamentFieldController (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
  });

  afterAll(async () => {
    await app?.close();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the in-pool tournament when multiple PGA tournaments share a start_date', async () => {
    // Mon May 4 2026 12:00 UTC (8 AM ET)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-04T12:00:00Z'));

    const pool = await createPool(ds);

    const sharedStart = new Date('2026-05-07T00:00:00Z');
    const sharedEnd = new Date('2026-05-10T23:59:00Z');

    // The opposite-field event ID sorts BEFORE the in-pool one alphabetically,
    // so without the array iteration the controller would 404 on it.
    await createPgaTournament(ds, {
      id: 'R2099weekly-aa-not-in-pool',
      name: 'Opposite-Field (May 7)',
      start_date: sharedStart,
      end_date: sharedEnd,
    });
    const inPool = await createPgaTournament(ds, {
      id: 'R2099weekly-bb-in-pool',
      name: 'Signature (May 7)',
      start_date: sharedStart,
      end_date: sharedEnd,
    });

    await createPoolTournament(ds, {
      pool,
      pgaTournament: inPool,
      league: pool.league,
    });

    const res = await request(app.getHttpServer())
      .get(`/pools/${pool.id}/weekly-field`)
      .expect(200);

    expect(res.body.pool_tournament.pga_tournament.id).toBe(inPool.id);
  });

  it('404s when no PGA tournament starts in the current week', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-10T12:00:00Z'));

    const pool = await createPool(ds);

    await request(app.getHttpServer()).get(`/pools/${pool.id}/weekly-field`).expect(404);
  });

  it('404s when weekly tournaments exist but none belong to the pool', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-14T12:00:00Z'));

    const pool = await createPool(ds);

    await createPgaTournament(ds, {
      id: 'R2099nonpool-sep',
      start_date: new Date('2026-09-17T00:00:00Z'),
      end_date: new Date('2026-09-20T23:59:00Z'),
    });

    await request(app.getHttpServer()).get(`/pools/${pool.id}/weekly-field`).expect(404);
  });
});
