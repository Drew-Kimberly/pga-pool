import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createPgaPlayer,
  createPgaTournament,
  createPgaTournamentPlayer,
} from '../../test-helpers/factories';
import { MockPgaTourApiService, setupTestApp } from '../../test-helpers/setup-test-app';
import { PgaTourApiService } from '../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentStatus } from '../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentPlayer } from '../pga-tournament-player/lib/pga-tournament-player.entity';

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
});
