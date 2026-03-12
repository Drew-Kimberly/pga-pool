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
} from '../../test-helpers/factories';
import { MockPgaTourApiService, setupTestApp } from '../../test-helpers/setup-test-app';
import { PgaTourApiService } from '../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentStatus } from '../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentPlayer } from '../pga-tournament-player/lib/pga-tournament-player.entity';
import { PoolTournamentUser } from '../pool-tournament-user/lib/pool-tournament-user.entity';

import { PgaTournamentScoreSyncWorker } from './pga-tournament-score-sync.worker';

import { INestApplication } from '@nestjs/common';

describe('PgaTournamentScoreSyncWorker (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let worker: PgaTournamentScoreSyncWorker;
  let mockPgaTourApi: MockPgaTourApiService;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    worker = moduleRef.get(PgaTournamentScoreSyncWorker);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('updates scores for IN_PROGRESS tournament', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const player = await createPgaPlayer(ds);
    await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament,
      overrides: { score_total: null },
    });

    // Stub leaderboard to return updated score
    mockPgaTourApi.getTournamentLeaderboard.mockResolvedValueOnce({
      leaderboardId: pgaTournament.id,
      leaderboard: {
        timezone: 'America/New_York',
        roundStatus: 'IN_PROGRESS',
        tournamentStatus: 'IN_PROGRESS',
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
              playerState: 'ACTIVE',
              total: '-5',
              totalSort: -5,
              thru: '12',
              thruSort: 12,
              position: '1',
              score: '-5',
              scoreSort: -5,
              currentRound: 1,
              teeTime: -1,
              courseId: '1',
              groupNumber: 1,
              roundHeader: 'R1',
              roundStatus: 'In Progress',
              totalStrokes: '67',
              oddsToWin: '',
            },
          },
        ],
      },
    });

    mockPgaTourApi.getProjectedFedexCupPoints.mockResolvedValueOnce({
      seasonYear: pgaTournament.year,
      lastUpdated: '',
      points: [
        {
          playerId: String(player.id),
          firstName: 'Player',
          lastName: String(player.id),
          tournamentId: pgaTournament.id,
          tournamentName: 'Test',
          playerPosition: '1',
          projectedEventPoints: '500',
        },
      ],
    });

    // Stub hole-by-hole (ingestScoringData) — return empty to keep test focused
    mockPgaTourApi.getLeaderboardHoleByHole.mockResolvedValue({
      playerData: [],
    });

    await worker.run({ pgaTournament });

    const updated = await ds
      .getRepository(PgaTournamentPlayer)
      .findOneBy({ id: `${player.id}-${pgaTournament.id}` });

    expect(updated?.score_total).toBe(-5);
    expect(updated?.projected_fedex_cup_points).toBe(500);
    expect(updated?.current_position).toBe('1');
  });

  it('skips non-IN_PROGRESS tournaments', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.COMPLETED,
    });
    const player = await createPgaPlayer(ds);
    await createPgaTournamentPlayer(ds, {
      pgaPlayer: player,
      pgaTournament,
      overrides: { score_total: -10 },
    });

    await worker.run({ pgaTournament });

    // API should never be called for non-IN_PROGRESS tournaments
    expect(mockPgaTourApi.getTournamentLeaderboard).not.toHaveBeenCalledWith(pgaTournament.id);
  });

  it('throws when no pgaTournament context is provided', async () => {
    await expect(worker.run({})).rejects.toThrow(
      'PgaTournamentScoreSyncWorker requires a pgaTournament context'
    );
  });

  it('updates pool user scores via domain event after syncing player scores', async () => {
    const pgaTournament = await createPgaTournament(ds, {
      tournament_status: PgaTournamentStatus.IN_PROGRESS,
    });
    const pool = await createPool(ds);
    const poolTournament = await createPoolTournament(ds, {
      pool,
      pgaTournament,
      league: pool.league,
    });

    // Create two players with picks
    const player1 = await createPgaPlayer(ds);
    const tp1 = await createPgaTournamentPlayer(ds, {
      pgaPlayer: player1,
      pgaTournament,
      overrides: { score_total: null, projected_fedex_cup_points: 0 },
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
      overrides: { score_total: null, projected_fedex_cup_points: 0 },
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

    // Stub leaderboard with scores for both players
    mockPgaTourApi.getTournamentLeaderboard.mockResolvedValueOnce({
      leaderboardId: pgaTournament.id,
      leaderboard: {
        timezone: 'America/New_York',
        roundStatus: 'IN_PROGRESS',
        tournamentStatus: 'IN_PROGRESS',
        formatType: 'STROKE_PLAY',
        players: [
          {
            id: String(player1.id).padStart(5, '0'),
            player: {
              firstName: 'Player',
              lastName: String(player1.id),
              displayName: `Player ${player1.id}`,
            },
            scoringData: {
              playerState: 'ACTIVE',
              total: '-5',
              totalSort: -5,
              thru: '18',
              thruSort: 18,
              position: '1',
              score: '-5',
              scoreSort: -5,
              currentRound: 1,
              teeTime: -1,
              courseId: '1',
              groupNumber: 1,
              roundHeader: 'R1',
              roundStatus: 'Complete',
              totalStrokes: '67',
              oddsToWin: '',
            },
          },
          {
            id: String(player2.id).padStart(5, '0'),
            player: {
              firstName: 'Player',
              lastName: String(player2.id),
              displayName: `Player ${player2.id}`,
            },
            scoringData: {
              playerState: 'ACTIVE',
              total: '-3',
              totalSort: -3,
              thru: '14',
              thruSort: 14,
              position: '2',
              score: '-3',
              scoreSort: -3,
              currentRound: 1,
              teeTime: -1,
              courseId: '1',
              groupNumber: 2,
              roundHeader: 'R1',
              roundStatus: 'In Progress',
              totalStrokes: '69',
              oddsToWin: '',
            },
          },
        ],
      },
    });

    mockPgaTourApi.getProjectedFedexCupPoints.mockResolvedValueOnce({
      seasonYear: pgaTournament.year,
      lastUpdated: '',
      points: [
        {
          playerId: String(player1.id),
          firstName: 'Player',
          lastName: String(player1.id),
          tournamentId: pgaTournament.id,
          tournamentName: 'Test',
          playerPosition: '1',
          projectedEventPoints: '500',
        },
        {
          playerId: String(player2.id),
          firstName: 'Player',
          lastName: String(player2.id),
          tournamentId: pgaTournament.id,
          tournamentName: 'Test',
          playerPosition: '2',
          projectedEventPoints: '300',
        },
      ],
    });

    mockPgaTourApi.getLeaderboardHoleByHole.mockResolvedValue({
      playerData: [],
    });

    await worker.run({ pgaTournament });

    // Wait for the async domain event handler to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updated = await ds.getRepository(PoolTournamentUser).findOneBy({ id: ptu.id });
    // tournament_score = SUM(score_total) = -5 + -3 = -8
    expect(updated?.tournament_score).toBe(-8);
    // fedex_cup_points = SUM(projected) = 500 + 300 = 800
    expect(updated?.fedex_cup_points).toBe(800);
  });
});
