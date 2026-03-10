import request from 'supertest';
import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createPgaTournament } from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';
import { PgaTournamentStatus } from '../lib/pga-tournament.interface';

import { INestApplication } from '@nestjs/common';

describe('PgaTournamentController (integration)', () => {
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

  it('lists PGA tournaments with pagination', async () => {
    await createPgaTournament(ds, { name: 'The Masters' });
    await createPgaTournament(ds, { name: 'US Open' });

    const res = await request(app.getHttpServer()).get('/pga-tournaments').expect(200);

    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.requested_size).toBeDefined();
    expect(res.body.meta.total).toBeGreaterThanOrEqual(2);
  });

  it('returns DTO shape with nested date and previous_champion', async () => {
    const t = await createPgaTournament(ds, {
      name: 'Test Tournament DTO',
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
      par: 72,
      yardage: 7200,
    });

    const res = await request(app.getHttpServer()).get('/pga-tournaments').expect(200);

    const entry = res.body.data.find((item: { id: string }) => item.id === t.id);
    expect(entry).toBeDefined();
    expect(entry.name).toBe('Test Tournament DTO');
    expect(entry.tournament_status).toBe(PgaTournamentStatus.IN_PROGRESS);
    expect(entry.par).toBe(72);
    expect(entry.yardage).toBe(7200);

    // Nested date DTO
    expect(entry.date).toBeDefined();
    expect(entry.date.year).toBeDefined();
    expect(entry.date.start).toBeDefined();
    expect(entry.date.end).toBeDefined();

    // Previous champion structure
    expect(entry.previous_champion).toBeDefined();
    expect(entry.previous_champion).toHaveProperty('id');
    expect(entry.previous_champion).toHaveProperty('name');
  });

  it('returns pagination metadata', async () => {
    await createPgaTournament(ds);

    const res = await request(app.getHttpServer()).get('/pga-tournaments').expect(200);

    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    expect(res.body.meta.requested_size).toBeDefined();
    expect(res.body.meta.number).toBe(1);
    expect(res.body.meta.actual_size).toBe(res.body.data.length);
  });
});
