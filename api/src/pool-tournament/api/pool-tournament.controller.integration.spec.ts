import request from 'supertest';
import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createPgaTournament,
  createPool,
  createPoolTournament,
} from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';

import { INestApplication } from '@nestjs/common';

describe('PoolTournamentController (integration)', () => {
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
  });

  it('lists pool tournaments ordered by start_date', async () => {
    const pool = await createPool(ds);

    const t1 = await createPgaTournament(ds, {
      start_date: new Date('2026-01-10'),
      end_date: new Date('2026-01-13'),
    });
    const t2 = await createPgaTournament(ds, {
      start_date: new Date('2026-02-14'),
      end_date: new Date('2026-02-17'),
    });

    const pt1 = await createPoolTournament(ds, {
      pool,
      pgaTournament: t1,
      league: pool.league,
    });
    const pt2 = await createPoolTournament(ds, {
      pool,
      pgaTournament: t2,
      league: pool.league,
    });

    const res = await request(app.getHttpServer()).get(`/pools/${pool.id}/tournaments`).expect(200);

    const ids = res.body.data.map((t: { id: string }) => t.id);
    const idx1 = ids.indexOf(pt1.id);
    const idx2 = ids.indexOf(pt2.id);
    expect(idx1).toBeGreaterThanOrEqual(0);
    expect(idx2).toBeGreaterThanOrEqual(0);
    expect(idx1).toBeLessThan(idx2);
  });

  it('returns all pool tournaments for a given pool', async () => {
    const pool = await createPool(ds);

    const t1 = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const t2 = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
    });

    const pt1 = await createPoolTournament(ds, {
      pool,
      pgaTournament: t1,
      league: pool.league,
    });
    const pt2 = await createPoolTournament(ds, {
      pool,
      pgaTournament: t2,
      league: pool.league,
    });

    const res = await request(app.getHttpServer()).get(`/pools/${pool.id}/tournaments`).expect(200);

    const ids = res.body.data.map((t: { id: string }) => t.id);
    expect(ids).toContain(pt1.id);
    expect(ids).toContain(pt2.id);

    // Verify DTO shape includes pga_tournament data
    const entry = res.body.data.find((t: { id: string }) => t.id === pt1.id);
    expect(entry.pga_tournament.tournament_status).toBe(PgaTournamentStatus.IN_PROGRESS);
  });

  it('returns a single tournament by ID', async () => {
    const pool = await createPool(ds);
    const pgaTournament = await createPgaTournament(ds);
    const pt = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    const res = await request(app.getHttpServer())
      .get(`/pools/${pool.id}/tournaments/${pt.id}`)
      .expect(200);

    expect(res.body.id).toBe(pt.id);
    expect(res.body.pga_tournament.id).toBe(pgaTournament.id);
    expect(res.body.pool.id).toBe(pool.id);
    expect(res.body.scores_are_official).toBe(false);
  });

  it('returns 404 for nonexistent pool tournament', async () => {
    const pool = await createPool(ds);
    const fakeId = '00000000-0000-0000-0000-000000000000';

    await request(app.getHttpServer()).get(`/pools/${pool.id}/tournaments/${fakeId}`).expect(404);
  });
});
