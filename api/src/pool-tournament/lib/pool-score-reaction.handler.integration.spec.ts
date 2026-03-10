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
import { PoolTournamentUser } from '../../pool-tournament-user/lib/pool-tournament-user.entity';

import { PoolScoreReactionHandler } from './pool-score-reaction.handler';

import { INestApplication } from '@nestjs/common';

describe('PoolScoreReactionHandler (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let handler: PoolScoreReactionHandler;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    handler = moduleRef.get(PoolScoreReactionHandler);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('recalculates tournament_score from pick score_total aggregation', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    // Two players with different scores
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
      overrides: { score_total: -3, projected_fedex_cup_points: 100 },
    });
    const ptp2 = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp2,
      poolTournament,
      overrides: { tier: 2 },
    });

    const poolUser = await createPoolUser(ds, { pool, league: pool.league });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp1,
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp2,
    });

    await handler.handle({ pgaTournament });

    const updated = await ds.getRepository(PoolTournamentUser).findOneBy({ id: ptu.id });
    // tournament_score = SUM(score_total) = -5 + -3 = -8
    expect(updated?.tournament_score).toBe(-8);
    // fedex_cup_points = SUM(projected) since not official = 200 + 100 = 300
    expect(updated?.fedex_cup_points).toBe(300);
  });

  it('uses official_fedex_cup_points when tournament has official flag', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
      official_fedex_cup_points_calculated: true,
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
      overrides: {
        score_total: -12,
        projected_fedex_cup_points: 500,
        official_fedex_cup_points: 600,
      },
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
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    await handler.handle({ pgaTournament });

    const updated = await ds.getRepository(PoolTournamentUser).findOneBy({ id: ptu.id });
    // Should use official (600), not projected (500)
    expect(updated?.fedex_cup_points).toBe(600);
  });

  it('handles null score_total (player has not started)', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
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
      overrides: { score_total: null, projected_fedex_cup_points: 0 },
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
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    await handler.handle({ pgaTournament });

    const updated = await ds.getRepository(PoolTournamentUser).findOneBy({ id: ptu.id });
    // SUM of null is null — SQL casts to int
    expect(updated?.tournament_score).toBeNull();
  });

  it('updates multiple pool tournaments for the same PGA tournament', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });

    const pool1 = await createPool(ds);
    const poolTournament1 = await createPoolTournament(ds, {
      pool: pool1,
      pgaTournament,
      league: pool1.league,
    });

    const player = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament,
      overrides: { score_total: -7, projected_fedex_cup_points: 300 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament: poolTournament1,
      overrides: { tier: 1 },
    });

    // Two different users in the same pool tournament
    const poolUser1 = await createPoolUser(ds, { pool: pool1, league: pool1.league });
    const poolUser2 = await createPoolUser(ds, { pool: pool1, league: pool1.league });

    const ptu1 = await createPoolTournamentUser(ds, {
      poolTournament: poolTournament1,
      poolUser: poolUser1,
      league: pool1.league,
    });
    const ptu2 = await createPoolTournamentUser(ds, {
      poolTournament: poolTournament1,
      poolUser: poolUser2,
      league: pool1.league,
    });

    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu1,
      poolTournamentPlayer: ptp,
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu2,
      poolTournamentPlayer: ptp,
    });

    await handler.handle({ pgaTournament });

    const updated1 = await ds.getRepository(PoolTournamentUser).findOneBy({ id: ptu1.id });
    const updated2 = await ds.getRepository(PoolTournamentUser).findOneBy({ id: ptu2.id });

    expect(updated1?.tournament_score).toBe(-7);
    expect(updated2?.tournament_score).toBe(-7);
    expect(updated1?.fedex_cup_points).toBe(300);
    expect(updated2?.fedex_cup_points).toBe(300);
  });

  it('does not update users with no picks (scores unchanged)', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    // User has no picks
    const poolUser = await createPoolUser(ds, { pool, league: pool.league });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { tournament_score: null, fedex_cup_points: 0 },
    });

    await handler.handle({ pgaTournament });

    const updated = await ds.getRepository(PoolTournamentUser).findOneBy({ id: ptu.id });
    // No picks → user not in GROUP BY subquery → UPDATE WHERE doesn't match → unchanged
    expect(updated?.tournament_score).toBeNull();
    expect(updated?.fedex_cup_points).toBe(0);
  });

  it('ignores pool tournaments for a different PGA tournament', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const otherPgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament: otherPgaTournament,
      league: pool.league,
    });

    const player = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament: otherPgaTournament,
      overrides: { score_total: -10, projected_fedex_cup_points: 999 },
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

    // Fire event for pgaTournament (not otherPgaTournament)
    await handler.handle({ pgaTournament });

    const updated = await ds.getRepository(PoolTournamentUser).findOneBy({ id: ptu.id });
    // Should be untouched — this pool tournament belongs to a different PGA tournament
    expect(updated?.tournament_score).toBeNull();
    expect(updated?.fedex_cup_points).toBe(0);
  });
});
