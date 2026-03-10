import request from 'supertest';
import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createPool, createPoolUser, createUser } from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';

import { INestApplication } from '@nestjs/common';

describe('PoolUserController (integration)', () => {
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

  it('lists pool users ordered by pool_score descending (FedEx default)', async () => {
    const pool = await createPool(ds);

    const user1 = await createUser(ds, { nickname: 'alice' });
    const user2 = await createUser(ds, { nickname: 'bob' });

    await createPoolUser(ds, {
      pool,
      user: user1,
      league: pool.league,
      overrides: { pool_score: 100 },
    });
    await createPoolUser(ds, {
      pool,
      user: user2,
      league: pool.league,
      overrides: { pool_score: 200 },
    });

    const res = await request(app.getHttpServer()).get(`/pools/${pool.id}/users`).expect(200);

    const data = res.body.data;
    expect(data.length).toBeGreaterThanOrEqual(2);

    // Find our test users in the response
    const alice = data.find((u: { user: { nickname: string } }) => u.user.nickname === 'alice');
    const bob = data.find((u: { user: { nickname: string } }) => u.user.nickname === 'bob');
    expect(alice).toBeDefined();
    expect(bob).toBeDefined();

    // Bob (200) should rank before Alice (100) in FedEx (DESC) scoring
    const aliceIdx = data.indexOf(alice);
    const bobIdx = data.indexOf(bob);
    expect(bobIdx).toBeLessThan(aliceIdx);
  });

  it('assigns tied ranks with same rank number', async () => {
    const pool = await createPool(ds);

    const user1 = await createUser(ds, { nickname: 'tied_a' });
    const user2 = await createUser(ds, { nickname: 'tied_b' });
    const user3 = await createUser(ds, { nickname: 'third' });

    await createPoolUser(ds, {
      pool,
      user: user1,
      league: pool.league,
      overrides: { pool_score: 500 },
    });
    await createPoolUser(ds, {
      pool,
      user: user2,
      league: pool.league,
      overrides: { pool_score: 500 },
    });
    await createPoolUser(ds, {
      pool,
      user: user3,
      league: pool.league,
      overrides: { pool_score: 300 },
    });

    const res = await request(app.getHttpServer()).get(`/pools/${pool.id}/users`).expect(200);

    const data = res.body.data;
    const tiedA = data.find((u: { user: { nickname: string } }) => u.user.nickname === 'tied_a');
    const tiedB = data.find((u: { user: { nickname: string } }) => u.user.nickname === 'tied_b');
    const third = data.find((u: { user: { nickname: string } }) => u.user.nickname === 'third');

    // Both tied users should have rank 1
    expect(tiedA.rank).toBe(1);
    expect(tiedB.rank).toBe(1);
    // Third user should have rank 3 (not 2 — standard competition ranking)
    expect(third.rank).toBe(3);
  });

  it('returns DTO shape with user details', async () => {
    const pool = await createPool(ds);
    const user = await createUser(ds, { name: 'Drew K', nickname: 'drewk' });
    const pu = await createPoolUser(ds, {
      pool,
      user,
      league: pool.league,
      overrides: { pool_score: 42 },
    });

    const res = await request(app.getHttpServer()).get(`/pools/${pool.id}/users`).expect(200);

    const entry = res.body.data.find((u: { id: string }) => u.id === pu.id);
    expect(entry).toBeDefined();
    expect(entry.pool_id).toBe(pool.id);
    expect(entry.pool_score).toBe(42);
    expect(entry.rank).toBeGreaterThanOrEqual(1);
    expect(entry.user.name).toBe('Drew K');
    expect(entry.user.nickname).toBe('drewk');
    expect(entry.created_at).toBeDefined();
    expect(entry.updated_at).toBeDefined();
  });

  it('returns 404 for nonexistent pool', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    await request(app.getHttpServer()).get(`/pools/${fakeId}/users`).expect(404);
  });
});
