import { Repository, SelectQueryBuilder } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';

import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentPlayerService } from '../../pga-tournament-player/lib/pga-tournament-player.service';
import { PgaTournamentPlayerStrokeService } from '../../pga-tournament-player-stroke/lib/pga-tournament-player-stroke.service';

import { PgaTournamentPlayerHole } from './pga-tournament-player-hole.entity';
import { HoleScoreStatus } from './pga-tournament-player-hole.interface';
import { PgaTournamentPlayerHoleService } from './pga-tournament-player-hole.service';

import { LoggerService } from '@nestjs/common';

function createMocks() {
  const holeRepo = {
    upsert: vi.fn().mockResolvedValue({}),
    find: vi.fn().mockResolvedValue([]),
    createQueryBuilder: vi.fn(),
  } as unknown as Repository<PgaTournamentPlayerHole>;

  const pgaTourApi = {
    getLeaderboardHoleByHole: vi.fn(),
  } as unknown as PgaTourApiService;

  const pgaTournamentPlayerService = {
    list: vi.fn().mockResolvedValue([]),
  } as unknown as PgaTournamentPlayerService;

  const strokeService = {
    ingestStrokesForPlayer: vi.fn().mockResolvedValue(undefined),
  } as unknown as PgaTournamentPlayerStrokeService;

  const logger = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as LoggerService;

  const service = new PgaTournamentPlayerHoleService(
    holeRepo,
    pgaTourApi,
    pgaTournamentPlayerService,
    strokeService,
    logger
  );

  return { holeRepo, pgaTourApi, pgaTournamentPlayerService, strokeService, logger, service };
}

describe('PgaTournamentPlayerHoleService', () => {
  describe('mapHoleScoreStatus', () => {
    it('maps GraphQL BIRDIE to entity birdie', () => {
      const { service } = createMocks();
      expect(service.mapHoleScoreStatus('BIRDIE')).toBe(HoleScoreStatus.Birdie);
    });

    it('maps GraphQL BOGEY to entity bogey', () => {
      const { service } = createMocks();
      expect(service.mapHoleScoreStatus('BOGEY')).toBe(HoleScoreStatus.Bogey);
    });

    it('maps GraphQL EAGLE to entity eagle', () => {
      const { service } = createMocks();
      expect(service.mapHoleScoreStatus('EAGLE')).toBe(HoleScoreStatus.Eagle);
    });

    it('maps GraphQL DOUBLE_BOGEY to entity double_bogey', () => {
      const { service } = createMocks();
      expect(service.mapHoleScoreStatus('DOUBLE_BOGEY')).toBe(HoleScoreStatus.DoubleBogey);
    });

    it('maps GraphQL PAR to entity par', () => {
      const { service } = createMocks();
      expect(service.mapHoleScoreStatus('PAR')).toBe(HoleScoreStatus.Par);
    });

    it('maps GraphQL NONE to entity none', () => {
      const { service } = createMocks();
      expect(service.mapHoleScoreStatus('NONE')).toBe(HoleScoreStatus.None);
    });

    it('maps GraphQL CONCEDED to entity none', () => {
      const { service } = createMocks();
      expect(service.mapHoleScoreStatus('CONCEDED')).toBe(HoleScoreStatus.None);
    });

    it('maps unknown values to none', () => {
      const { service } = createMocks();
      expect(service.mapHoleScoreStatus('UNKNOWN_STATUS')).toBe(HoleScoreStatus.None);
    });
  });

  describe('ingestHolesForRound', () => {
    it('upserts hole data from leaderboardHoleByHole API response', async () => {
      const { service, holeRepo, pgaTourApi } = createMocks();

      vi.spyOn(pgaTourApi, 'getLeaderboardHoleByHole').mockResolvedValue({
        __typename: 'LeaderboardHoleByHole',
        tournamentId: 'R2025003',
        tournamentName: 'Test Tournament',
        currentRound: 1,
        courseHoleHeaders: [],
        courses: [],
        rounds: [],
        holeHeaders: [],
        playerData: [
          {
            __typename: 'PlayerRowHoleByHole',
            playerId: '46046',
            courseId: '1',
            courseCode: 'TPC',
            in: '33',
            out: '33',
            total: '66',
            totalToPar: '-5',
            scores: [
              {
                __typename: 'HoleScore',
                holeNumber: 1,
                par: 4,
                score: '3',
                roundScore: '-1',
                status: 'BIRDIE',
                sequenceNumber: 1,
                yardage: 432,
              },
              {
                __typename: 'HoleScore',
                holeNumber: 2,
                par: 3,
                score: '3',
                roundScore: '-1',
                status: 'PAR',
                sequenceNumber: 2,
                yardage: 195,
              },
            ],
          },
        ],
      });

      await service.ingestHolesForRound('R2025003', 1);

      expect(pgaTourApi.getLeaderboardHoleByHole).toHaveBeenCalledWith('R2025003', 1);
      expect(holeRepo.upsert).toHaveBeenCalledTimes(1);

      const [rows, options] = (holeRepo.upsert as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(options).toEqual({
        conflictPaths: ['pga_tournament_player_id', 'round_number', 'hole_number'],
      });
      expect(rows).toHaveLength(2);
      expect(rows[0]).toEqual({
        pga_tournament_player_id: '46046-R2025003',
        round_number: 1,
        hole_number: 1,
        par: 4,
        score: 3,
        to_par: -1,
        status: HoleScoreStatus.Birdie,
        yardage: 432,
        sequence: 1,
      });
    });

    it('skips holes with score of 0 (not yet played)', async () => {
      const { service, holeRepo, pgaTourApi } = createMocks();

      vi.spyOn(pgaTourApi, 'getLeaderboardHoleByHole').mockResolvedValue({
        __typename: 'LeaderboardHoleByHole',
        tournamentId: 'R2025003',
        tournamentName: 'Test Tournament',
        currentRound: 1,
        courseHoleHeaders: [],
        courses: [],
        rounds: [],
        holeHeaders: [],
        playerData: [
          {
            __typename: 'PlayerRowHoleByHole',
            playerId: '46046',
            courseId: '1',
            courseCode: 'TPC',
            in: null,
            out: null,
            total: null,
            totalToPar: '0',
            scores: [
              {
                __typename: 'HoleScore',
                holeNumber: 1,
                par: 4,
                score: '0',
                roundScore: '0',
                status: 'NONE',
                sequenceNumber: 1,
                yardage: 432,
              },
            ],
          },
        ],
      });

      await service.ingestHolesForRound('R2025003', 1);

      expect(holeRepo.upsert).not.toHaveBeenCalled();
    });

    it('handles empty player data gracefully', async () => {
      const { service, holeRepo, pgaTourApi } = createMocks();

      vi.spyOn(pgaTourApi, 'getLeaderboardHoleByHole').mockResolvedValue({
        __typename: 'LeaderboardHoleByHole',
        tournamentId: 'R2025003',
        tournamentName: 'Test Tournament',
        currentRound: 1,
        courseHoleHeaders: [],
        courses: [],
        rounds: [],
        holeHeaders: [],
        playerData: [],
      });

      await service.ingestHolesForRound('R2025003', 1);

      expect(holeRepo.upsert).not.toHaveBeenCalled();
    });
  });

  describe('getRoundSummaries', () => {
    it('returns aggregated round summaries', async () => {
      const { service, holeRepo } = createMocks();

      const qb = {
        select: vi.fn().mockReturnThis(),
        addSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        groupBy: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getRawMany: vi.fn().mockResolvedValue([
          { round_number: 1, strokes: '66', to_par: '-5' },
          { round_number: 2, strokes: '70', to_par: '-1' },
        ]),
      } as unknown as SelectQueryBuilder<PgaTournamentPlayerHole>;

      vi.spyOn(holeRepo, 'createQueryBuilder').mockReturnValue(qb);

      const result = await service.getRoundSummaries('player-123');

      expect(result).toEqual([
        { round_number: 1, strokes: 66, to_par: -5 },
        { round_number: 2, strokes: 70, to_par: -1 },
      ]);
    });
  });
});
