import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  createPgaPlayer,
  createPgaTournament,
  createPgaTournamentPlayer,
} from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';
import {
  PgaApiProjectedFedexCupPointsResponse,
  PgaApiTournamentLeaderboardResponse,
} from '../../pga-tour-api/lib/v2/pga-tour-api.interface';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';

import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PlayerStatus } from './pga-tournament-player.interface';
import { PgaTournamentPlayerService } from './pga-tournament-player.service';

import { INestApplication } from '@nestjs/common';

describe('PgaTournamentPlayerService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let service: PgaTournamentPlayerService;
  let mockPgaTourApi: Record<string, ReturnType<typeof vi.fn>>;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    service = moduleRef.get(PgaTournamentPlayerService);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('ensurePlayersFromField', () => {
    it('inserts players from field via INSERT ON CONFLICT DO NOTHING', async () => {
      const pgaTournament = await createPgaTournament(ds, {
        tournament_status: PgaTournamentStatus.IN_PROGRESS,
      });
      const player1 = await createPgaPlayer(ds);
      const player2 = await createPgaPlayer(ds);

      mockPgaTourApi.getField.mockResolvedValueOnce({
        __typename: 'Field',
        id: pgaTournament.id,
        tournamentName: pgaTournament.name,
        players: [
          { __typename: 'PlayerField', id: String(player1.id), status: 'ACTIVE', withdrawn: false },
          { __typename: 'PlayerField', id: String(player2.id), status: 'ACTIVE', withdrawn: false },
        ],
      });

      await service.ensurePlayersFromField(pgaTournament);

      const rows = await ds.getRepository(PgaTournamentPlayer).find({
        where: { pga_tournament: { id: pgaTournament.id } },
      });
      expect(rows).toHaveLength(2);
      expect(rows.map((r) => r.pga_player.id).sort()).toEqual([player1.id, player2.id].sort());
    });

    it('is idempotent — re-running does not duplicate rows', async () => {
      const pgaTournament = await createPgaTournament(ds, {
        tournament_status: PgaTournamentStatus.IN_PROGRESS,
      });
      const player = await createPgaPlayer(ds);

      const fieldResponse = {
        __typename: 'Field' as const,
        id: pgaTournament.id,
        tournamentName: pgaTournament.name,
        players: [
          {
            __typename: 'PlayerField' as const,
            id: String(player.id),
            status: 'ACTIVE',
            withdrawn: false,
          },
        ],
      };

      mockPgaTourApi.getField.mockResolvedValueOnce(fieldResponse);
      await service.ensurePlayersFromField(pgaTournament);

      mockPgaTourApi.getField.mockResolvedValueOnce(fieldResponse);
      await service.ensurePlayersFromField(pgaTournament);

      const rows = await ds.getRepository(PgaTournamentPlayer).find({
        where: { pga_tournament: { id: pgaTournament.id } },
      });
      expect(rows).toHaveLength(1);
    });

    it('marks stale players as withdrawn for NOT_STARTED tournaments', async () => {
      const pgaTournament = await createPgaTournament(ds, {
        tournament_status: PgaTournamentStatus.NOT_STARTED,
      });
      const player1 = await createPgaPlayer(ds);
      const player2 = await createPgaPlayer(ds);

      // Pre-insert player2 as active (simulates a previous field sync)
      await createPgaTournamentPlayer(ds, {
        pgaPlayer: player2,
        pgaTournament,
        overrides: { status: PlayerStatus.Active, active: true },
      });

      // New field only contains player1 — player2 is now stale
      mockPgaTourApi.getField.mockResolvedValueOnce({
        __typename: 'Field',
        id: pgaTournament.id,
        tournamentName: pgaTournament.name,
        players: [
          { __typename: 'PlayerField', id: String(player1.id), status: 'ACTIVE', withdrawn: false },
        ],
      });

      await service.ensurePlayersFromField(pgaTournament);

      const stalePlayer = await ds
        .getRepository(PgaTournamentPlayer)
        .findOneBy({ id: `${player2.id}-${pgaTournament.id}` });
      expect(stalePlayer?.status).toBe(PlayerStatus.Withdrawn);
      expect(stalePlayer?.active).toBe(false);
    });
  });

  describe('updateScores', () => {
    it('upserts leaderboard data into DB', async () => {
      const pgaTournament = await createPgaTournament(ds, {
        tournament_status: PgaTournamentStatus.IN_PROGRESS,
      });
      const player = await createPgaPlayer(ds);
      await createPgaTournamentPlayer(ds, {
        pgaPlayer: player,
        pgaTournament,
        overrides: { score_total: null },
      });

      const leaderboard: PgaApiTournamentLeaderboardResponse = {
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
                firstName: player.first_name,
                lastName: player.last_name,
                displayName: player.name,
              },
              scoringData: {
                playerState: 'ACTIVE',
                total: '-7',
                totalSort: -7,
                thru: '14',
                thruSort: 14,
                position: '1',
                score: '-3',
                scoreSort: -3,
                currentRound: 2,
                teeTime: -1,
                courseId: '1',
                groupNumber: 1,
                roundHeader: 'R2',
                roundStatus: 'R2 In Progress',
                totalStrokes: '65',
                oddsToWin: '+300',
              },
            },
          ],
        },
      };
      mockPgaTourApi.getTournamentLeaderboard.mockResolvedValueOnce(leaderboard);

      const projectedPoints: PgaApiProjectedFedexCupPointsResponse = {
        seasonYear: 2026,
        lastUpdated: '2026-01-16T12:00:00Z',
        points: [],
      };
      mockPgaTourApi.getProjectedFedexCupPoints.mockResolvedValueOnce(projectedPoints);

      await service.updateScores(pgaTournament);

      const updated = await ds
        .getRepository(PgaTournamentPlayer)
        .findOneBy({ id: `${player.id}-${pgaTournament.id}` });
      expect(updated?.score_total).toBe(-7);
      expect(updated?.score_thru).toBe(14);
      expect(updated?.current_position).toBe('1');
      expect(updated?.current_round).toBe(2);
      expect(updated?.status).toBe(PlayerStatus.Active);
    });

    it('marks missing players as withdrawn', async () => {
      const pgaTournament = await createPgaTournament(ds, {
        tournament_status: PgaTournamentStatus.IN_PROGRESS,
      });
      const playerActive = await createPgaPlayer(ds);
      const playerMissing = await createPgaPlayer(ds);
      await createPgaTournamentPlayer(ds, {
        pgaPlayer: playerActive,
        pgaTournament,
        overrides: { status: PlayerStatus.Active, active: true },
      });
      await createPgaTournamentPlayer(ds, {
        pgaPlayer: playerMissing,
        pgaTournament,
        overrides: { status: PlayerStatus.Active, active: true },
      });

      // Leaderboard has only playerActive — playerMissing should be marked withdrawn
      const leaderboard: PgaApiTournamentLeaderboardResponse = {
        leaderboardId: pgaTournament.id,
        leaderboard: {
          timezone: 'America/New_York',
          roundStatus: 'IN_PROGRESS',
          tournamentStatus: 'IN_PROGRESS',
          formatType: 'STROKE_PLAY',
          players: [
            {
              id: String(playerActive.id).padStart(5, '0'),
              player: {
                firstName: playerActive.first_name,
                lastName: playerActive.last_name,
                displayName: playerActive.name,
              },
              scoringData: {
                playerState: 'ACTIVE',
                total: '-3',
                totalSort: -3,
                thru: 'F',
                thruSort: 19,
                position: '1',
                score: '-3',
                scoreSort: -3,
                currentRound: 1,
                teeTime: -1,
                courseId: '1',
                groupNumber: 1,
                roundHeader: 'R1',
                roundStatus: 'R1 Complete',
                totalStrokes: '69',
                oddsToWin: '',
              },
            },
          ],
        },
      };
      mockPgaTourApi.getTournamentLeaderboard.mockResolvedValueOnce(leaderboard);
      mockPgaTourApi.getProjectedFedexCupPoints.mockResolvedValueOnce({
        seasonYear: 2026,
        lastUpdated: '',
        points: [],
      });

      await service.updateScores(pgaTournament);

      const updated = await ds
        .getRepository(PgaTournamentPlayer)
        .findOneBy({ id: `${playerMissing.id}-${pgaTournament.id}` });
      expect(updated?.status).toBe(PlayerStatus.Withdrawn);
      expect(updated?.active).toBe(false);
    });
  });
});
