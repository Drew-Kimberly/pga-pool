import request from 'supertest';
import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createPgaPlayer,
  createPgaTournament,
  createPgaTournamentPlayer,
} from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';

import { INestApplication } from '@nestjs/common';

describe('PgaTournamentPlayerController (integration)', () => {
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

  it('lists players for a tournament ordered by score_total ASC', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const player1 = await createPgaPlayer(ds, { name: 'Low Scorer' });
    const player2 = await createPgaPlayer(ds, { name: 'High Scorer' });

    await createPgaTournamentPlayer(ds, {
      pgaPlayer: player1,
      pgaTournament,
      overrides: { score_total: -10 },
    });
    await createPgaTournamentPlayer(ds, {
      pgaPlayer: player2,
      pgaTournament,
      overrides: { score_total: 2 },
    });

    const res = await request(app.getHttpServer())
      .get(`/pga-tournaments/${pgaTournament.id}/players`)
      .expect(200);

    const data = res.body.data;
    expect(data.length).toBeGreaterThanOrEqual(2);

    const lowIdx = data.findIndex(
      (p: { pga_player: { name: string } }) => p.pga_player.name === 'Low Scorer'
    );
    const highIdx = data.findIndex(
      (p: { pga_player: { name: string } }) => p.pga_player.name === 'High Scorer'
    );

    // Lower score_total should appear first (ASC ordering)
    expect(lowIdx).toBeLessThan(highIdx);
  });

  it('returns DTO shape with nested pga_player and pga_tournament', async () => {
    const pgaTournament = await createPgaTournament(ds, { name: 'DTO Shape Test' });
    const player = await createPgaPlayer(ds, {
      name: 'Rory McIlroy',
      country: 'Northern Ireland',
      country_flag: 'NIR',
    });
    const tp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament,
      overrides: { score_total: -8, current_position: 'T3' },
    });

    const res = await request(app.getHttpServer())
      .get(`/pga-tournaments/${pgaTournament.id}/players`)
      .expect(200);

    const entry = res.body.data.find((p: { id: string }) => p.id === tp.id);
    expect(entry).toBeDefined();

    // Tournament player fields
    expect(entry.score_total).toBe(-8);
    expect(entry.current_position).toBe('T3');
    expect(entry.rounds).toBeDefined();
    expect(Array.isArray(entry.rounds)).toBe(true);

    // Nested PGA player DTO
    expect(entry.pga_player.id).toBe(player.id);
    expect(entry.pga_player.name).toBe('Rory McIlroy');
    expect(entry.pga_player.country_flag_url).toBe(
      'https://res.cloudinary.com/pgatour-prod/flags/NIR.svg'
    );

    // Nested PGA tournament DTO
    expect(entry.pga_tournament.id).toBe(pgaTournament.id);
    expect(entry.pga_tournament.name).toBe('DTO Shape Test');
  });

  it('returns 404 for nonexistent PGA tournament', async () => {
    await request(app.getHttpServer()).get('/pga-tournaments/NONEXISTENT-999/players').expect(404);
  });

  it('returns pagination metadata', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const player = await createPgaPlayer(ds);
    await createPgaTournamentPlayer(ds, { pgaPlayer: player, pgaTournament });

    const res = await request(app.getHttpServer())
      .get(`/pga-tournaments/${pgaTournament.id}/players`)
      .expect(200);

    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    expect(res.body.meta.requested_size).toBeDefined();
    expect(res.body.meta.number).toBe(1);
  });
});
