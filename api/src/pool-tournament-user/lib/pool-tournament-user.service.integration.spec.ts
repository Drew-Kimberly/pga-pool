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
import { PlayerStatus } from '../../pga-tournament-player/lib/pga-tournament-player.interface';

import { PoolTournamentUserService } from './pool-tournament-user.service';

import { INestApplication } from '@nestjs/common';

describe('PoolTournamentUserService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let service: PoolTournamentUserService;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    service = moduleRef.get(PoolTournamentUserService);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('list() returns users with full relation tree including picks', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    const pgaPlayer = await createPgaPlayer(ds);
    const tournamentPlayer = await createPgaTournamentPlayer(ds, {
      pgaPlayer,
      pgaTournament,
      overrides: { score_total: -5 },
    });
    const poolTournamentPlayer = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tournamentPlayer,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, { pool, league: pool.league });
    const poolTournamentUser = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser,
      poolTournamentPlayer,
    });

    const result = await service.list({ poolTournamentId: poolTournament.id });

    expect(result).toHaveLength(1);
    expect(result[0].picks).toHaveLength(1);
    expect(result[0].picks[0].pool_tournament_player).toBeDefined();
    expect(result[0].picks[0].pool_tournament_player.pga_tournament_player).toBeDefined();
    expect(
      result[0].picks[0].pool_tournament_player.pga_tournament_player.pga_tournament
    ).toBeDefined();
    expect(result[0].pool_user).toBeDefined();
    expect(result[0].pool_user.user).toBeDefined();
  });

  it('updateScores() computes tournament_score as sum of picks score_total', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    const player1 = await createPgaPlayer(ds);
    const player2 = await createPgaPlayer(ds);
    const tp1 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player1,
      pgaTournament,
      overrides: { score_total: -5 },
    });
    const tp2 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player2,
      pgaTournament,
      overrides: { score_total: -3 },
    });
    const ptp1 = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp1,
      poolTournament,
      overrides: { tier: 1 },
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

    await service.updateScores(poolTournament.id);

    const updated = await service.list({ poolTournamentId: poolTournament.id });
    expect(updated[0].tournament_score).toBe(-8);
  });

  it('updateScores() uses projected_fedex_cup_points when not officially calculated', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      official_fedex_cup_points_calculated: false,
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
      overrides: { projected_fedex_cup_points: 100.5, official_fedex_cup_points: null },
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

    await service.updateScores(poolTournament.id);

    const updated = await service.list({ poolTournamentId: poolTournament.id });
    expect(updated[0].fedex_cup_points).toBe(100.5);
  });

  it('updateScores() uses official_fedex_cup_points when flag is true', async () => {
    const pgaTournament = await createPgaTournament(ds, {
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
      overrides: { projected_fedex_cup_points: 50, official_fedex_cup_points: 200 },
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

    await service.updateScores(poolTournament.id);

    const updated = await service.list({ poolTournamentId: poolTournament.id });
    expect(updated[0].fedex_cup_points).toBe(200);
  });

  it('updateScores() handles null score_total picks', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    const player1 = await createPgaPlayer(ds);
    const player2 = await createPgaPlayer(ds);
    const tp1 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player1,
      pgaTournament,
      overrides: { score_total: -3, status: PlayerStatus.Active },
    });
    const tp2 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player2,
      pgaTournament,
      overrides: { score_total: null, status: PlayerStatus.Withdrawn },
    });
    const ptp1 = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp1,
      poolTournament,
      overrides: { tier: 1 },
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

    await service.updateScores(poolTournament.id);

    const updated = await service.list({ poolTournamentId: poolTournament.id });
    // null + (-3) = -3 (null score_total is treated as 0 after first non-null)
    expect(updated[0].tournament_score).toBe(-3);
  });
});
