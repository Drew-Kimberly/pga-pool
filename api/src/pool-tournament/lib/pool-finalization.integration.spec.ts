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
import { DomainEventBus } from '../../domain-events/domain-event-bus';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import type { PgaTournamentEventMap } from '../../pga-tournament/lib/pga-tournament.events';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';
import { PgaTournamentPlayerService } from '../../pga-tournament-player/lib/pga-tournament-player.service';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';
import { PoolTournamentUser } from '../../pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

import { PoolFinalizationService } from './pool-finalization.service';
import { PoolTournament } from './pool-tournament.entity';

import { INestApplication } from '@nestjs/common';

interface ScenarioOverrides {
  scoringFormat?: PoolScoringFormat;
  tournamentStatus?: PgaTournamentStatus;
  officialCalculated?: boolean;
  scoreTotal?: number | null;
  projectedPoints?: number;
  officialPoints?: number | null;
}

describe('Pool finalization (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let finalizationService: PoolFinalizationService;
  let eventBus: DomainEventBus;
  let pgaTournamentPlayerService: PgaTournamentPlayerService;
  let mockPgaTourApi: MockPgaTourApiService;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    finalizationService = moduleRef.get(PoolFinalizationService);
    eventBus = moduleRef.get(DomainEventBus);
    pgaTournamentPlayerService = moduleRef.get(PgaTournamentPlayerService);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
  });

  afterAll(async () => {
    await app?.close();
  });

  /**
   * Builds an isolated pool tournament with a single user picking a single
   * player, so a finalize produces a deterministic pool_score delta.
   */
  async function createScenario(overrides: ScenarioOverrides = {}) {
    const {
      scoringFormat = PoolScoringFormat.FedexCuptPoints,
      tournamentStatus = PgaTournamentStatus.COMPLETED,
      officialCalculated = false,
      scoreTotal = -8,
      projectedPoints = 0,
      officialPoints = 500,
    } = overrides;

    const pool = await createPool(ds, {
      overrides: { settings: { scoring_format: scoringFormat } },
    });
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: tournamentStatus,
      official_fedex_cup_points_calculated: officialCalculated,
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
      overrides: {
        score_total: scoreTotal,
        projected_fedex_cup_points: projectedPoints,
        official_fedex_cup_points: officialPoints,
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

    return { pgaTournament, poolTournament, poolUser, poolTournamentUser: ptu, player };
  }

  const reloadPoolUser = (id: string) => ds.getRepository(PoolUser).findOneByOrFail({ id });
  const reloadPoolTournament = (id: string) =>
    ds.getRepository(PoolTournament).findOneByOrFail({ id });
  const reloadPoolTournamentUser = (id: string) =>
    ds.getRepository(PoolTournamentUser).findOneByOrFail({ id });

  async function waitFor(
    predicate: () => Promise<boolean>,
    { timeoutMs = 3000, intervalMs = 25 } = {}
  ) {
    const start = Date.now();
    for (;;) {
      if (await predicate()) return;
      if (Date.now() - start > timeoutMs) {
        throw new Error('waitFor timed out');
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  it('skips a FedEx pool at COMPLETED before official points are calculated (no zero lock-in)', async () => {
    const { pgaTournament, poolTournament, poolUser, poolTournamentUser } = await createScenario({
      officialCalculated: false,
    });

    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);

    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(false);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(0);
    // Untouched: no recompute ran, so the transient projected zero is not baked in.
    expect((await reloadPoolTournamentUser(poolTournamentUser.id)).fedex_cup_points).toBe(0);
  });

  it('finalizes a FedEx pool when official points arrive after COMPLETED, once', async () => {
    const { pgaTournament, poolTournament, poolUser, poolTournamentUser } = await createScenario({
      officialCalculated: false,
    });

    // status-updated arrives first: FedEx pool is not ready, so it is skipped.
    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);
    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(false);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(0);

    // Official points land → flag flips → official-points-calculated retriggers.
    await ds
      .getRepository(PgaTournament)
      .update(pgaTournament.id, { official_fedex_cup_points_calculated: true });
    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);

    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(true);
    expect((await reloadPoolTournamentUser(poolTournamentUser.id)).fedex_cup_points).toBe(500);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(500);

    // Re-firing does not double-count.
    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(500);
  });

  it('finalizes a FedEx pool in one pass when official points are already calculated at COMPLETED', async () => {
    const { pgaTournament, poolTournament, poolUser, poolTournamentUser } = await createScenario({
      officialCalculated: true,
    });

    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);

    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(true);
    expect((await reloadPoolTournamentUser(poolTournamentUser.id)).fedex_cup_points).toBe(500);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(500);
  });

  it('is idempotent across repeated finalize calls', async () => {
    const { pgaTournament, poolUser } = await createScenario({ officialCalculated: true });

    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);
    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);
    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);

    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(500);
  });

  it('finalizes a strokes pool at COMPLETED regardless of FedEx official flag', async () => {
    const { pgaTournament, poolTournament, poolUser, poolTournamentUser } = await createScenario({
      scoringFormat: PoolScoringFormat.Strokes,
      officialCalculated: false,
      scoreTotal: -8,
    });

    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);

    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(true);
    expect((await reloadPoolTournamentUser(poolTournamentUser.id)).tournament_score).toBe(-8);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(-8);
  });

  it('does not finalize before the tournament reaches COMPLETED', async () => {
    const { pgaTournament, poolTournament, poolUser } = await createScenario({
      tournamentStatus: PgaTournamentStatus.IN_PROGRESS,
      officialCalculated: true,
    });

    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);

    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(false);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(0);
  });

  it('emits official-points-calculated from score ingestion, healing a finished FedEx pool end-to-end', async () => {
    // COMPLETED FedEx tournament whose projected points already collapsed to 0
    // and whose official points have not been calculated yet — the failure case.
    const { pgaTournament, poolTournament, poolUser, poolTournamentUser, player } =
      await createScenario({
        officialCalculated: false,
        projectedPoints: 0,
        officialPoints: null,
      });

    // status-updated arrived first and (correctly) skipped this not-ready pool.
    await finalizationService.finalizeReadyPoolTournaments(pgaTournament.id);
    expect((await reloadPoolTournament(poolTournament.id)).scores_are_official).toBe(false);

    // Field/score sync computes official points. Projected endpoint returns 0
    // for the finished event; season results carry the real official points.
    mockPgaTourApi.getTournamentLeaderboard.mockResolvedValue({
      leaderboardId: pgaTournament.id,
      leaderboard: {
        timezone: 'America/New_York',
        roundStatus: 'OFFICIAL',
        tournamentStatus: 'COMPLETED',
        formatType: 'STROKE_PLAY',
        players: [
          {
            id: String(player.id).padStart(5, '0'),
            player: {
              firstName: 'Player',
              lastName: String(player.id),
              displayName: `Player ${player.id}`,
            },
            scoringData: {
              playerState: 'COMPLETE',
              total: '-8',
              totalSort: -8,
              thru: '18',
              thruSort: 18,
              position: '1',
              score: '-8',
              scoreSort: -8,
              currentRound: 4,
              teeTime: -1,
              courseId: '1',
              groupNumber: 1,
              roundHeader: 'R4',
              roundStatus: 'Complete',
              totalStrokes: '272',
              oddsToWin: '',
            },
          },
        ],
      },
    });
    mockPgaTourApi.getProjectedFedexCupPoints.mockResolvedValue({
      seasonYear: pgaTournament.year,
      lastUpdated: '',
      points: [],
    });
    mockPgaTourApi.getPlayerSeasonResults.mockResolvedValue({
      resultsData: [
        {
          title: 'FedExCup',
          // index 10 carries the official FedEx Cup points value
          data: [{ tournamentId: pgaTournament.id, fields: Array(10).fill('').concat('500') }],
        },
      ],
    });

    await pgaTournamentPlayerService.upsertFieldForTournament(pgaTournament.id);

    // The official-points-calculated event fires fire-and-forget; wait for the
    // finalization handler to mark the pool official.
    await waitFor(async () => (await reloadPoolTournament(poolTournament.id)).scores_are_official);

    expect(
      (
        await ds
          .getRepository(PgaTournamentPlayer)
          .findOneByOrFail({ id: `${player.id}-${pgaTournament.id}` })
      ).official_fedex_cup_points
    ).toBe(500);
    expect((await reloadPoolTournamentUser(poolTournamentUser.id)).fedex_cup_points).toBe(500);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(500);
  });

  it('wires the official-points-calculated event to finalization', async () => {
    const { pgaTournament, poolTournament, poolUser } = await createScenario({
      officialCalculated: true,
    });

    eventBus.emit<PgaTournamentEventMap>('pga-tournament.official-points-calculated', {
      pgaTournament,
    });

    await waitFor(async () => (await reloadPoolTournament(poolTournament.id)).scores_are_official);
    expect((await reloadPoolUser(poolUser.id)).pool_score).toBe(500);
  });
});
