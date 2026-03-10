import request from 'supertest';
import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createPgaPlayer,
  createPgaTournament,
  createPgaTournamentPlayer,
  createPool,
  createPoolTournament,
  createPoolTournamentPlayer,
  createPoolTournamentUser,
  createPoolTournamentUserPick,
  createPoolUser,
} from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';

import { INestApplication } from '@nestjs/common';

describe('PoolTournamentUserController (integration)', () => {
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

  it('returns ranked users with picks and scores', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const pool = await createPool(ds, {
      overrides: {
        settings: { scoring_format: PoolScoringFormat.FedexCuptPoints },
      },
    });
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    const player = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament,
      overrides: { score_total: -8, projected_fedex_cup_points: 300 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, { pool, league: pool.league });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { tournament_score: -8, fedex_cup_points: 300 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    const res = await request(app.getHttpServer())
      .get(`/pools/${pool.id}/tournaments/${poolTournament.id}/users`)
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    const user = res.body.data[0];
    expect(user.id).toBe(ptu.id);
    expect(user.rank).toBe('1');
    expect(user.score).toBe(-8);
    expect(user.fedex_cup_points).toBe(300);
    expect(user.user.id).toBe(poolUser.user.id);
    expect(user.picks).toHaveLength(1);
    expect(user.picks[0].tier).toBe(1);
    expect(user.picks[0].pga_tournament_player.id).toBe(tp.id);
    expect(user.picks[0].pga_tournament_player.score_total).toBe(-8);
  });

  it('ranks tied users with T prefix', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const pool = await createPool(ds, {
      overrides: {
        settings: { scoring_format: PoolScoringFormat.FedexCuptPoints },
      },
    });
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    // Two users with the same fedex_cup_points → tied
    const player1 = await createPgaPlayer(ds);
    const tp1 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player1,
      pgaTournament,
      overrides: { score_total: -5, projected_fedex_cup_points: 200 },
    });
    const ptp1 = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp1,
      poolTournament,
      overrides: { tier: 1 },
    });

    const player2 = await createPgaPlayer(ds);
    const tp2 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player2,
      pgaTournament,
      overrides: { score_total: -5, projected_fedex_cup_points: 200 },
    });
    const ptp2 = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp2,
      poolTournament,
      overrides: { tier: 2 },
    });

    const poolUser1 = await createPoolUser(ds, { pool, league: pool.league });
    const ptu1 = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser: poolUser1,
      league: pool.league,
      overrides: { tournament_score: -5, fedex_cup_points: 200 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu1,
      poolTournamentPlayer: ptp1,
    });

    const poolUser2 = await createPoolUser(ds, { pool, league: pool.league });
    const ptu2 = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser: poolUser2,
      league: pool.league,
      overrides: { tournament_score: -5, fedex_cup_points: 200 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu2,
      poolTournamentPlayer: ptp2,
    });

    const res = await request(app.getHttpServer())
      .get(`/pools/${pool.id}/tournaments/${poolTournament.id}/users`)
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].rank).toBe('T1');
    expect(res.body.data[1].rank).toBe('T1');
  });

  it('orders by tournament_score ASC for Strokes scoring format', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const pool = await createPool(ds, {
      overrides: {
        settings: { scoring_format: PoolScoringFormat.Strokes },
      },
    });
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    const player1 = await createPgaPlayer(ds);
    const tp1 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player1,
      pgaTournament,
      overrides: { score_total: -10 },
    });
    const ptp1 = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp1,
      poolTournament,
      overrides: { tier: 1 },
    });

    const player2 = await createPgaPlayer(ds);
    const tp2 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player2,
      pgaTournament,
      overrides: { score_total: -3 },
    });
    const ptp2 = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp2,
      poolTournament,
      overrides: { tier: 2 },
    });

    // User1 has higher (worse) score, User2 has lower (better) score
    const poolUser1 = await createPoolUser(ds, { pool, league: pool.league });
    const ptu1 = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser: poolUser1,
      league: pool.league,
      overrides: { tournament_score: -3 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu1,
      poolTournamentPlayer: ptp2,
    });

    const poolUser2 = await createPoolUser(ds, { pool, league: pool.league });
    const ptu2 = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser: poolUser2,
      league: pool.league,
      overrides: { tournament_score: -10 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu2,
      poolTournamentPlayer: ptp1,
    });

    const res = await request(app.getHttpServer())
      .get(`/pools/${pool.id}/tournaments/${poolTournament.id}/users`)
      .expect(200);

    expect(res.body.data).toHaveLength(2);
    // ASC ordering: -10 comes before -3
    expect(res.body.data[0].score).toBe(-10);
    expect(res.body.data[1].score).toBe(-3);
    expect(res.body.data[0].rank).toBe('1');
    expect(res.body.data[1].rank).toBe('2');
  });

  it('returns 404 when pool tournament does not exist', async () => {
    const pool = await createPool(ds);
    const fakeId = '00000000-0000-0000-0000-000000000000';

    await request(app.getHttpServer())
      .get(`/pools/${pool.id}/tournaments/${fakeId}/users`)
      .expect(404);
  });

  it('nullifies fedex_cup_points in DTO when tournament_score is null', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.NOT_STARTED,
    });
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    const player = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament,
      overrides: { score_total: null },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, { pool, league: pool.league });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { tournament_score: null, fedex_cup_points: 0 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    const res = await request(app.getHttpServer())
      .get(`/pools/${pool.id}/tournaments/${poolTournament.id}/users`)
      .expect(200);

    const user = res.body.data[0];
    expect(user.score).toBeNull();
    // DTO logic: when tournament_score is null, fedex_cup_points should also be null
    expect(user.fedex_cup_points).toBeNull();
  });
});
