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
import { PgaPlayer } from '../../pga-player/lib/pga-player.entity';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';
import { PoolTournamentUser } from '../../pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

import { OfficialPointsResyncService } from './official-points-resync.service';
import { PoolTournament } from './pool-tournament.entity';

import { INestApplication } from '@nestjs/common';

describe('OfficialPointsResyncService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let resyncService: OfficialPointsResyncService;
  let mockPgaTourApi: MockPgaTourApiService;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    resyncService = moduleRef.get(OfficialPointsResyncService);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
  });

  afterAll(async () => {
    await app?.close();
  });

  /**
   * Models the incident being repaired: a finalized FedEx pool whose user
   * picked two players, one persisted correctly (750) and one wrongly zeroed
   * by a partial feed (should be 201).
   */
  async function createFinalizedScenario(overrides: { officialCalculated?: boolean } = {}) {
    const { officialCalculated = true } = overrides;

    const pool = await createPool(ds);
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
      official_fedex_cup_points_calculated: officialCalculated,
    });
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
      overrides: { scores_are_official: true },
    });

    const freshPlayer = await createPgaPlayer(ds);
    const stalePlayer = await createPgaPlayer(ds);
    const freshTp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: freshPlayer,
      pgaTournament,
      overrides: { current_position: '1', score_total: -17, official_fedex_cup_points: 750 },
    });
    const staleTp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: stalePlayer,
      pgaTournament,
      overrides: { current_position: 'T7', score_total: -6, official_fedex_cup_points: 0 },
    });

    const poolUser = await createPoolUser(ds, {
      pool,
      league: pool.league,
      overrides: { pool_score: 750 },
    });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
      overrides: { fedex_cup_points: 750 },
    });
    for (const tp of [freshTp, staleTp]) {
      const ptp = await createPoolTournamentPlayer(ds, {
        pgaTournamentPlayer: tp,
        poolTournament,
        overrides: { tier: 1 },
      });
      await createPoolTournamentUserPick(ds, {
        poolTournamentUser: ptu,
        poolTournamentPlayer: ptp,
      });
    }

    mockSettledSeasonResults(pgaTournament, { [freshPlayer.id]: '750', [stalePlayer.id]: '201' });

    return {
      pgaTournament,
      poolTournament,
      poolUser,
      poolTournamentUser: ptu,
      freshPlayer,
      stalePlayer,
    };
  }

  function mockSettledSeasonResults(
    pgaTournament: PgaTournament,
    pointsByPlayerId: Record<number, string>
  ) {
    mockPgaTourApi.getPlayerSeasonResults.mockImplementation(async (playerId: number) => {
      const points = pointsByPlayerId[playerId];
      if (points === undefined) {
        return { resultsData: [{ title: 'FedExCup', data: [] }] };
      }
      return {
        resultsData: [
          {
            title: 'FedExCup',
            // index 10 carries the official FedEx Cup points value
            data: [{ tournamentId: pgaTournament.id, fields: Array(10).fill('').concat(points) }],
          },
        ],
      };
    });
  }

  const reloadPoolUser = (id: string) => ds.getRepository(PoolUser).findOneByOrFail({ id });
  const reloadPoolTournament = (id: string) =>
    ds.getRepository(PoolTournament).findOneByOrFail({ id });
  const reloadPoolTournamentUser = (id: string) =>
    ds.getRepository(PoolTournamentUser).findOneByOrFail({ id });
  const reloadTournamentPlayer = (player: PgaPlayer, pgaTournament: PgaTournament) =>
    ds
      .getRepository(PgaTournamentPlayer)
      .findOneByOrFail({ id: `${player.id}-${pgaTournament.id}` });

  it('corrects wrongly-zeroed players and delta-adjusts finalized pool scores, idempotently', async () => {
    const { pgaTournament, poolUser, poolTournamentUser, stalePlayer } =
      await createFinalizedScenario();

    const result = await resyncService.resync(pgaTournament.id);

    expect(result.playerCorrections).toEqual([
      {
        pgaPlayerId: stalePlayer.id,
        playerName: stalePlayer.name,
        previousPoints: 0,
        updatedPoints: 201,
      },
    ]);
    expect(
      (await reloadTournamentPlayer(stalePlayer, pgaTournament)).official_fedex_cup_points
    ).toBe(201);
    expect((await reloadPoolTournamentUser(poolTournamentUser.id)).fedex_cup_points).toBe(951);
    // The 750 already credited at finalization is adjusted by the delta, not re-added.
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(951);
    expect(result.poolTournamentAdjustments).toEqual([
      expect.objectContaining({
        scoresWereOfficial: true,
        userAdjustments: [
          {
            poolUserId: poolUser.id,
            previousFedexCupPoints: 750,
            updatedFedexCupPoints: 951,
            poolScoreDelta: 201,
          },
        ],
      }),
    ]);

    // Re-running once the feed and database agree changes nothing.
    const secondRun = await resyncService.resync(pgaTournament.id);
    expect(secondRun.playerCorrections).toEqual([]);
    expect(secondRun.poolTournamentAdjustments).toEqual([
      expect.objectContaining({ userAdjustments: [] }),
    ]);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(951);
  });

  it('reports corrections without writing anything in dry-run mode', async () => {
    const { pgaTournament, poolUser, poolTournamentUser, stalePlayer } =
      await createFinalizedScenario();

    const result = await resyncService.resync(pgaTournament.id, { dryRun: true });

    expect(result.dryRun).toBe(true);
    expect(result.playerCorrections).toHaveLength(1);
    expect(result.poolTournamentAdjustments).toEqual([]);
    expect(
      (await reloadTournamentPlayer(stalePlayer, pgaTournament)).official_fedex_cup_points
    ).toBe(0);
    expect((await reloadPoolTournamentUser(poolTournamentUser.id)).fedex_cup_points).toBe(750);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(750);
  });

  it('refuses to resync from a feed that is only partially propagated', async () => {
    const { pgaTournament, poolUser, stalePlayer } = await createFinalizedScenario();

    // The stale player's feed has no row at all for the event.
    mockPgaTourApi.getPlayerSeasonResults.mockImplementation(async (playerId: number) =>
      playerId === stalePlayer.id
        ? { resultsData: [{ title: 'FedExCup', data: [] }] }
        : {
            resultsData: [
              {
                title: 'FedExCup',
                data: [
                  { tournamentId: pgaTournament.id, fields: Array(10).fill('').concat('750') },
                ],
              },
            ],
          }
    );

    await expect(resyncService.resync(pgaTournament.id)).rejects.toThrow(/unsettled/);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(750);
  });

  it('heals a pool finalized before the official-points feature existed', async () => {
    // Legacy shape: pool finalized from projected-derived totals while the
    // tournament's official flag was never set (pre-feature finalization).
    const { pgaTournament, poolTournament, poolUser, poolTournamentUser } =
      await createFinalizedScenario({ officialCalculated: false });

    await resyncService.resync(pgaTournament.id);

    expect(
      (await ds.getRepository(PgaTournament).findOneByOrFail({ id: pgaTournament.id }))
        .official_fedex_cup_points_calculated
    ).toBe(true);
    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(true);
    expect((await reloadPoolTournamentUser(poolTournamentUser.id)).fedex_cup_points).toBe(951);
    // Corrected by delta on top of the previously credited 750.
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(951);
  });

  it('finalizes a still-pending pool once the resync lands official points', async () => {
    const pool = await createPool(ds);
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
      official_fedex_cup_points_calculated: false,
    });
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });
    const tp = await createPgaTournamentPlayer(ds, {
      pgaPlayer: await createPgaPlayer(ds),
      pgaTournament,
      overrides: { current_position: '2', score_total: -9, official_fedex_cup_points: null },
    });
    const poolUser = await createPoolUser(ds, { pool, league: pool.league });
    const ptu = await createPoolTournamentUser(ds, {
      poolTournament,
      poolUser,
      league: pool.league,
    });
    const ptp = await createPoolTournamentPlayer(ds, {
      pgaTournamentPlayer: tp,
      poolTournament,
      overrides: { tier: 1 },
    });
    await createPoolTournamentUserPick(ds, { poolTournamentUser: ptu, poolTournamentPlayer: ptp });

    mockSettledSeasonResults(pgaTournament, { [tp.pga_player.id]: '500' });

    await resyncService.resync(pgaTournament.id);

    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(true);
    expect((await reloadPoolTournamentUser(ptu.id)).fedex_cup_points).toBe(500);
    // Credited in full by finalization, not delta-adjusted twice.
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(500);
  });
});
