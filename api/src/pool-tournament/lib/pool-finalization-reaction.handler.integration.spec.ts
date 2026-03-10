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
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

import { PoolFinalizationReactionHandler } from './pool-finalization-reaction.handler';
import { PoolTournament } from './pool-tournament.entity';

import { INestApplication } from '@nestjs/common';

describe('PoolFinalizationReactionHandler (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let handler: PoolFinalizationReactionHandler;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    handler = moduleRef.get(PoolFinalizationReactionHandler);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('increments pool_user.pool_score by fedex_cup_points on COMPLETED', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
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
      overrides: { score_total: -10, projected_fedex_cup_points: 400 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 50 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { fedex_cup_points: 400 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    await handler.handle({
      pgaTournament,
      previousStatus: PgaTournamentStatus.IN_PROGRESS,
      newStatus: PgaTournamentStatus.COMPLETED,
    });

    const updatedPoolUser = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    // pool_score: 50 (initial) + 400 (fedex_cup_points) = 450
    expect(updatedPoolUser?.pool_score).toBe(450);

    const updatedPt = await ds.getRepository(PoolTournament).findOneBy({ id: poolTournament.id });
    expect(updatedPt?.scores_are_official).toBe(true);
  });

  it('increments pool_user.pool_score by tournament_score for Strokes format', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
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

    const player = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament,
      overrides: { score_total: -6 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 20 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { tournament_score: -6 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    await handler.handle({
      pgaTournament,
      previousStatus: PgaTournamentStatus.IN_PROGRESS,
      newStatus: PgaTournamentStatus.COMPLETED,
    });

    const updatedPoolUser = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    // pool_score: 20 + (-6) = 14
    expect(updatedPoolUser?.pool_score).toBe(14);
  });

  it('skips already-official pool tournaments (idempotency)', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
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
      overrides: { scores_are_official: true },
    });

    const player = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament,
      overrides: { projected_fedex_cup_points: 500 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 100 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { fedex_cup_points: 500 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    await handler.handle({
      pgaTournament,
      previousStatus: PgaTournamentStatus.IN_PROGRESS,
      newStatus: PgaTournamentStatus.COMPLETED,
    });

    const updatedPoolUser = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    // Should remain 100 — not incremented again
    expect(updatedPoolUser?.pool_score).toBe(100);
  });

  it('ignores non-COMPLETED status transitions', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 0 },
    });
    await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { fedex_cup_points: 999 },
    });

    // NOT_STARTED → IN_PROGRESS: should not finalize
    await handler.handle({
      pgaTournament,
      previousStatus: PgaTournamentStatus.NOT_STARTED,
      newStatus: PgaTournamentStatus.IN_PROGRESS,
    });

    const updatedPoolUser = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    expect(updatedPoolUser?.pool_score).toBe(0);

    const updatedPt = await ds.getRepository(PoolTournament).findOneBy({ id: poolTournament.id });
    expect(updatedPt?.scores_are_official).toBe(false);
  });

  it('handles COALESCE for users with zero fedex_cup_points', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
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
      overrides: { score_total: 5, projected_fedex_cup_points: 0 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 200 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { fedex_cup_points: 0 },
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    await handler.handle({
      pgaTournament,
      previousStatus: PgaTournamentStatus.IN_PROGRESS,
      newStatus: PgaTournamentStatus.COMPLETED,
    });

    const updatedPoolUser = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    // COALESCE(0, 0) = 0, so pool_score unchanged
    expect(updatedPoolUser?.pool_score).toBe(200);

    const updatedPt = await ds.getRepository(PoolTournament).findOneBy({ id: poolTournament.id });
    expect(updatedPt?.scores_are_official).toBe(true);
  });
});
