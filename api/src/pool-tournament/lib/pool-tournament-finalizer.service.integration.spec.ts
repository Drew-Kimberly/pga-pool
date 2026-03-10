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
import { MockPgaTourApiService, setupTestApp } from '../../../test-helpers/setup-test-app';
import {
  PgaApiProjectedFedexCupPointsResponse,
  PgaApiTournamentLeaderboardResponse,
} from '../../pga-tour-api/lib/v2/pga-tour-api.interface';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

import { PoolTournament } from './pool-tournament.entity';
import { PoolTournamentFinalizerService } from './pool-tournament-finalizer.service';

import { INestApplication } from '@nestjs/common';

describe('PoolTournamentFinalizerService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let finalizerService: PoolTournamentFinalizerService;
  let mockPgaTourApi: MockPgaTourApiService;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    finalizerService = moduleRef.get(PoolTournamentFinalizerService);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
  });

  afterAll(async () => {
    await app?.close();
  });

  /**
   * Helper: configure mock PGA Tour API to return a leaderboard with the given players.
   * Each entry maps playerId → totalSort score + optional projected FedEx points.
   */
  function stubLeaderboard(
    tournamentId: string,
    year: number,
    entries: Array<{
      playerId: number;
      totalSort: number;
      position: string;
      projectedFedexPoints?: number;
    }>
  ) {
    const leaderboard: PgaApiTournamentLeaderboardResponse = {
      leaderboardId: tournamentId,
      leaderboard: {
        timezone: 'America/New_York',
        roundStatus: 'IN_PROGRESS',
        tournamentStatus: 'IN_PROGRESS',
        formatType: 'STROKE_PLAY',
        players: entries.map((e) => ({
          id: String(e.playerId).padStart(5, '0'),
          player: {
            firstName: 'Player',
            lastName: String(e.playerId),
            displayName: `Player ${e.playerId}`,
          },
          scoringData: {
            playerState: 'ACTIVE',
            total: String(e.totalSort),
            totalSort: e.totalSort,
            thru: 'F',
            thruSort: 19,
            position: e.position,
            score: String(e.totalSort),
            scoreSort: e.totalSort,
            currentRound: 4,
            teeTime: -1,
            courseId: '1',
            groupNumber: 1,
            roundHeader: 'R4',
            roundStatus: 'R4 Complete',
            totalStrokes: '280',
            oddsToWin: '',
          },
        })),
      },
    };
    mockPgaTourApi.getTournamentLeaderboard.mockResolvedValueOnce(leaderboard);

    const projectedPoints: PgaApiProjectedFedexCupPointsResponse = {
      seasonYear: year,
      lastUpdated: '',
      points: entries
        .filter((e) => e.projectedFedexPoints != null)
        .map((e) => ({
          playerId: String(e.playerId),
          firstName: 'Player',
          lastName: String(e.playerId),
          tournamentId,
          tournamentName: 'Test',
          playerPosition: e.position,
          projectedEventPoints: String(e.projectedFedexPoints),
        })),
    };
    mockPgaTourApi.getProjectedFedexCupPoints.mockResolvedValueOnce(projectedPoints);
  }

  it('finalizes pool tournament with FedEx scoring — pool_user.pool_score updated', async () => {
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
      overrides: { score_total: -12, projected_fedex_cup_points: 500 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 0 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    stubLeaderboard(pgaTournament.id, pgaTournament.year, [
      { playerId: player.id, totalSort: -12, position: '1', projectedFedexPoints: 500 },
    ]);

    await finalizerService.finalizePoolTournament(poolTournament.id);

    // Check pool_user.pool_score was incremented by fedex_cup_points
    const updatedPoolUser = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    expect(updatedPoolUser?.pool_score).toBe(500);

    // Check scores_are_official is true
    const updatedPoolTournament = await ds
      .getRepository(PoolTournament)
      .findOneBy({ id: poolTournament.id });
    expect(updatedPoolTournament?.scores_are_official).toBe(true);
  });

  it('finalizes with Strokes scoring format', async () => {
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
      overrides: { score_total: -8 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 10 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    stubLeaderboard(pgaTournament.id, pgaTournament.year, [
      { playerId: player.id, totalSort: -8, position: 'T3' },
    ]);

    await finalizerService.finalizePoolTournament(poolTournament.id);

    const updatedPoolUser = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    // pool_score starts at 10, delta is tournament_score (-8)
    expect(updatedPoolUser?.pool_score).toBe(2);
  });

  it('sets scores_are_official to true after finalization', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
    });
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    stubLeaderboard(pgaTournament.id, pgaTournament.year, []);

    await finalizerService.finalizePoolTournament(poolTournament.id);

    const updated = await ds.getRepository(PoolTournament).findOneBy({ id: poolTournament.id });
    expect(updated?.scores_are_official).toBe(true);
  });

  it('re-finalization is skipped (no double-counting)', async () => {
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
      overrides: { score_total: -5, projected_fedex_cup_points: 250 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 0 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    // First finalization
    stubLeaderboard(pgaTournament.id, pgaTournament.year, [
      { playerId: player.id, totalSort: -5, position: '5', projectedFedexPoints: 250 },
    ]);
    await finalizerService.finalizePoolTournament(poolTournament.id);

    const afterFirst = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    const firstScore = afterFirst?.pool_score;

    // Second finalization — should be a no-op
    await finalizerService.finalizePoolTournament(poolTournament.id);

    const afterSecond = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    expect(afterSecond?.pool_score).toBe(firstScore);
  });

  it('SERIALIZABLE transaction + advisory lock prevents concurrent corruption', async () => {
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
      overrides: { score_total: -10, projected_fedex_cup_points: 100 },
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 0 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
    });
    await createPoolTournamentUserPick(ds, {
      poolTournamentUser: ptu,
      poolTournamentPlayer: ptp,
    });

    // Stub leaderboard for both concurrent calls
    stubLeaderboard(pgaTournament.id, pgaTournament.year, [
      { playerId: player.id, totalSort: -10, position: '1', projectedFedexPoints: 100 },
    ]);
    stubLeaderboard(pgaTournament.id, pgaTournament.year, [
      { playerId: player.id, totalSort: -10, position: '1', projectedFedexPoints: 100 },
    ]);

    // Run two finalizations concurrently — advisory lock should serialize them
    await Promise.all([
      finalizerService.finalizePoolTournament(poolTournament.id),
      finalizerService.finalizePoolTournament(poolTournament.id),
    ]);

    // pool_score should be 100 (added once), NOT 200 (added twice)
    const finalPoolUser = await ds.getRepository(PoolUser).findOneBy({ id: poolUser.id });
    expect(finalPoolUser?.pool_score).toBe(100);
  });
});
