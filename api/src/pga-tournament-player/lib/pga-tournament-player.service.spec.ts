import { InsertQueryBuilder, Repository } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';

import { DomainEventBus } from '../../domain-events/domain-event-bus';
import { PgaPlayerService } from '../../pga-player/lib/pga-player.service';
import {
  PgaApiProjectedFedexCupPointsResponse,
  PgaApiTournamentLeaderboardResponse,
} from '../../pga-tour-api/lib/v2/pga-tour-api.interface';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';

import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PlayerStatus } from './pga-tournament-player.interface';
import { PgaTournamentPlayerService } from './pga-tournament-player.service';

import { LoggerService } from '@nestjs/common';

function createEventBusMock(): DomainEventBus {
  return { emit: vi.fn() } as unknown as DomainEventBus;
}

describe('PgaTournamentPlayerService', () => {
  describe('updateScores', () => {
    it('upserts updated leaderboard data in bulk', async () => {
      const repo = {
        upsert: vi.fn().mockResolvedValue({}),
        find: vi.fn().mockResolvedValue([]),
        update: vi.fn().mockResolvedValue({}),
      } as unknown as Repository<PgaTournamentPlayer>;
      const pgaTourApi = {
        getTournamentLeaderboard: vi.fn(),
        getProjectedFedexCupPoints: vi.fn(),
      } as unknown as PgaTourApiService;
      const pgaPlayerService = {
        save: vi.fn(),
      } as unknown as PgaPlayerService;
      const pgaTournamentService = {
        get: vi.fn(),
      } as unknown as PgaTournamentService;
      const logger = {
        warn: vi.fn(),
        error: vi.fn(),
        log: vi.fn(),
      } as unknown as LoggerService;

      const eventBus = createEventBusMock();
      const service = new PgaTournamentPlayerService(
        repo,
        pgaTourApi,
        pgaPlayerService,
        pgaTournamentService,
        eventBus,
        logger
      );

      const tournament: Partial<PgaTournament> = {
        id: 'R2023006',
        year: 2023,
        name: 'Test Tournament',
        tournament_id: '006',
      };
      vi.spyOn(pgaTournamentService, 'get').mockResolvedValue(tournament as PgaTournament);

      const leaderboardResponse: PgaApiTournamentLeaderboardResponse = {
        leaderboardId: 'R2023006',
        leaderboard: {
          timezone: 'America/Los_Angeles',
          roundStatus: 'IN_PROGRESS',
          tournamentStatus: 'IN_PROGRESS',
          formatType: 'STROKE_PLAY',
          players: [
            {
              id: '01234',
              player: {
                firstName: 'Alpha',
                lastName: 'Player',
                displayName: 'Alpha Player',
              },
              scoringData: {
                playerState: 'ACTIVE',
                total: '-3',
                thruSort: 10,
                position: 'T1',
                thru: '10',
                score: '-1',
                scoreSort: -1,
                currentRound: 2,
                totalSort: -3,
                teeTime: -1,
                courseId: '1',
                groupNumber: 1,
                roundHeader: 'R2',
                roundStatus: 'R2 In Progress',
                totalStrokes: '69',
                oddsToWin: '+500',
              },
            },
          ],
        },
      };
      vi.spyOn(pgaTourApi, 'getTournamentLeaderboard').mockResolvedValue(leaderboardResponse);

      const projectedPointsResponse: PgaApiProjectedFedexCupPointsResponse = {
        seasonYear: 2023,
        lastUpdated: '2023-01-01T00:00:00Z',
        points: [
          {
            tournamentId: 'R2023006',
            playerId: '1234',
            firstName: 'Alpha',
            lastName: 'Player',
            tournamentName: 'Test Tournament',
            playerPosition: 'T1',
            projectedEventPoints: '100.5',
          },
          {
            tournamentId: 'R2023006',
            playerId: '23456',
            firstName: 'Beta',
            lastName: 'Player',
            tournamentName: 'Test Tournament',
            playerPosition: 'CUT',
            projectedEventPoints: '12',
          },
        ],
      };
      vi.spyOn(pgaTourApi, 'getProjectedFedexCupPoints').mockResolvedValue(projectedPointsResponse);

      await service.updateScores(tournament.id!, repo);

      expect(repo.upsert).toHaveBeenCalledTimes(1);
      expect(pgaTourApi.getProjectedFedexCupPoints).toHaveBeenCalledWith(2023, '006');
      const [updatesArg, conflict] = (repo.upsert as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(conflict).toEqual(['id']);
      expect(updatesArg).toEqual([
        {
          id: '1234-R2023006',
          pga_player: { id: 1234 },
          pga_tournament: { id: 'R2023006' },
          active: true,
          current_hole: 11,
          current_position: 'T1',
          current_round: 2,
          is_round_complete: false,
          score_thru: 10,
          score_total: -3,
          starting_hole: 1,
          status: PlayerStatus.Active,
          tee_time: null,
          projected_fedex_cup_points: 100.5,
        },
      ]);
    });

    it('marks players missing from leaderboard as withdrawn', async () => {
      const repo = {
        upsert: vi.fn().mockResolvedValue({}),
        find: vi.fn().mockResolvedValue([
          {
            id: '5678-R2023006',
            pga_player: { id: 5678 },
            status: PlayerStatus.Active,
          },
        ]),
        update: vi.fn().mockResolvedValue({}),
      } as unknown as Repository<PgaTournamentPlayer>;
      const pgaTourApi = {
        getTournamentLeaderboard: vi.fn(),
        getProjectedFedexCupPoints: vi.fn(),
      } as unknown as PgaTourApiService;
      const pgaPlayerService = {
        save: vi.fn(),
      } as unknown as PgaPlayerService;
      const pgaTournamentService = {
        get: vi.fn(),
      } as unknown as PgaTournamentService;
      const logger = {
        warn: vi.fn(),
        error: vi.fn(),
        log: vi.fn(),
      } as unknown as LoggerService;

      const eventBus = createEventBusMock();
      const service = new PgaTournamentPlayerService(
        repo,
        pgaTourApi,
        pgaPlayerService,
        pgaTournamentService,
        eventBus,
        logger
      );

      const tournament: Partial<PgaTournament> = {
        id: 'R2023006',
        year: 2023,
        name: 'Test Tournament',
        tournament_id: '006',
      };
      vi.spyOn(pgaTournamentService, 'get').mockResolvedValue(tournament as PgaTournament);

      const leaderboardResponse: PgaApiTournamentLeaderboardResponse = {
        leaderboardId: 'R2023006',
        leaderboard: {
          timezone: 'America/Los_Angeles',
          roundStatus: 'IN_PROGRESS',
          tournamentStatus: 'IN_PROGRESS',
          formatType: 'STROKE_PLAY',
          players: [
            {
              id: '01234',
              player: {
                firstName: 'Alpha',
                lastName: 'Player',
                displayName: 'Alpha Player',
              },
              scoringData: {
                playerState: 'ACTIVE',
                total: '-3',
                thruSort: 10,
                position: 'T1',
                thru: '10',
                score: '-1',
                scoreSort: -1,
                currentRound: 2,
                totalSort: -3,
                teeTime: -1,
                courseId: '1',
                groupNumber: 1,
                roundHeader: 'R2',
                roundStatus: 'R2 In Progress',
                totalStrokes: '69',
                oddsToWin: '+500',
              },
            },
          ],
        },
      };
      vi.spyOn(pgaTourApi, 'getTournamentLeaderboard').mockResolvedValue(leaderboardResponse);

      const projectedPointsResponse: PgaApiProjectedFedexCupPointsResponse = {
        seasonYear: 2023,
        lastUpdated: '2023-01-01T00:00:00Z',
        points: [],
      };
      vi.spyOn(pgaTourApi, 'getProjectedFedexCupPoints').mockResolvedValue(projectedPointsResponse);

      await service.updateScores(tournament.id!, repo);

      expect(repo.find).toHaveBeenCalledWith({
        where: {
          pga_tournament: { id: 'R2023006' },
          status: expect.anything(),
        },
      });
      expect(repo.update).toHaveBeenCalledWith(['5678-R2023006'], {
        active: false,
        status: PlayerStatus.Withdrawn,
      });
    });
  });

  describe('ensurePlayersFromField', () => {
    function createMocks() {
      const insertBuilder = {
        into: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        orIgnore: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({}),
      } as unknown as InsertQueryBuilder<PgaTournamentPlayer>;

      const repo = {
        createQueryBuilder: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue(insertBuilder),
        }),
        find: vi.fn().mockResolvedValue([]),
        update: vi.fn().mockResolvedValue({}),
      } as unknown as Repository<PgaTournamentPlayer>;

      const pgaTourApi = {
        getField: vi.fn(),
      } as unknown as PgaTourApiService;

      const pgaPlayerService = {
        listByIds: vi.fn(),
      } as unknown as PgaPlayerService;

      const pgaTournamentService = {} as unknown as PgaTournamentService;

      const eventBus = createEventBusMock();

      const logger = {
        warn: vi.fn(),
        error: vi.fn(),
        log: vi.fn(),
      } as unknown as LoggerService;

      const service = new PgaTournamentPlayerService(
        repo,
        pgaTourApi,
        pgaPlayerService,
        pgaTournamentService,
        eventBus,
        logger
      );

      return { repo, pgaTourApi, pgaPlayerService, logger, service, insertBuilder };
    }

    it('creates records with correct status and score_thru for completed tournaments', async () => {
      const { pgaTourApi, pgaPlayerService, service, insertBuilder } = createMocks();

      const tournament = {
        id: 'R2023006',
        tournament_status: PgaTournamentStatus.COMPLETED,
      } as PgaTournament;

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [
          { __typename: 'PlayerField', id: '1234', status: 'ACTIVE', withdrawn: false },
          { __typename: 'PlayerField', id: '5678', status: 'ACTIVE', withdrawn: false },
        ],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([
        { id: 1234 },
        { id: 5678 },
      ] as never);

      await service.ensurePlayersFromField(tournament);

      expect(pgaTourApi.getField).toHaveBeenCalledWith('R2023006');
      expect(pgaPlayerService.listByIds).toHaveBeenCalledWith([1234, 5678]);

      const valuesArg = (insertBuilder.values as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(valuesArg).toHaveLength(2);
      expect(valuesArg[0]).toEqual(
        expect.objectContaining({
          id: '1234-R2023006',
          status: PlayerStatus.Complete,
          score_thru: 18,
          is_round_complete: true,
          active: true,
        })
      );
      expect(insertBuilder.orIgnore).toHaveBeenCalled();
      expect(insertBuilder.execute).toHaveBeenCalled();
    });

    it('sets withdrawn players with status Withdrawn and null score_thru', async () => {
      const { pgaTourApi, pgaPlayerService, service, insertBuilder } = createMocks();

      const tournament = {
        id: 'R2023006',
        tournament_status: PgaTournamentStatus.COMPLETED,
      } as PgaTournament;

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [{ __typename: 'PlayerField', id: '1234', status: 'WITHDRAWN', withdrawn: true }],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([{ id: 1234 }] as never);

      await service.ensurePlayersFromField(tournament);

      const valuesArg = (insertBuilder.values as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(valuesArg[0]).toEqual(
        expect.objectContaining({
          id: '1234-R2023006',
          status: PlayerStatus.Withdrawn,
          score_thru: null,
          is_round_complete: false,
          active: false,
        })
      );
    });

    it('filters out players not in pga_player table', async () => {
      const { pgaTourApi, pgaPlayerService, service, insertBuilder } = createMocks();

      const tournament = {
        id: 'R2023006',
        tournament_status: PgaTournamentStatus.COMPLETED,
      } as PgaTournament;

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [
          { __typename: 'PlayerField', id: '1234', status: 'ACTIVE', withdrawn: false },
          { __typename: 'PlayerField', id: '9999', status: 'ACTIVE', withdrawn: false },
        ],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([{ id: 1234 }] as never);

      await service.ensurePlayersFromField(tournament);

      const valuesArg = (insertBuilder.values as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(valuesArg).toHaveLength(1);
      expect(valuesArg[0].id).toBe('1234-R2023006');
    });

    it('handles empty field data gracefully', async () => {
      const { pgaTourApi, pgaPlayerService, logger, service, insertBuilder } = createMocks();

      const tournament = {
        id: 'R2023006',
        tournament_status: PgaTournamentStatus.COMPLETED,
      } as PgaTournament;

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [],
      });

      await service.ensurePlayersFromField(tournament);

      expect(pgaPlayerService.listByIds).not.toHaveBeenCalled();
      expect(insertBuilder.execute).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });

    it('sets Active status for in-progress tournaments', async () => {
      const { pgaTourApi, pgaPlayerService, service, insertBuilder } = createMocks();

      const tournament = {
        id: 'R2023006',
        tournament_status: PgaTournamentStatus.IN_PROGRESS,
      } as PgaTournament;

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [{ __typename: 'PlayerField', id: '1234', status: 'ACTIVE', withdrawn: false }],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([{ id: 1234 }] as never);

      await service.ensurePlayersFromField(tournament);

      const valuesArg = (insertBuilder.values as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(valuesArg[0]).toEqual(
        expect.objectContaining({
          status: PlayerStatus.Active,
          score_thru: null,
          is_round_complete: false,
        })
      );
    });

    it('marks stale rows as withdrawn for NOT_STARTED tournaments', async () => {
      const { repo, pgaTourApi, pgaPlayerService, logger, service } = createMocks();

      const tournament = {
        id: 'R2023006',
        tournament_status: PgaTournamentStatus.NOT_STARTED,
      } as PgaTournament;

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [{ __typename: 'PlayerField', id: '1234', status: 'ACTIVE', withdrawn: false }],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([{ id: 1234 }] as never);

      // Simulate an existing row for player 5678 that is NOT in the incoming field
      vi.spyOn(repo, 'find').mockResolvedValue([
        { id: '1234-R2023006', pga_player: { id: 1234 } },
        { id: '5678-R2023006', pga_player: { id: 5678 } },
      ] as PgaTournamentPlayer[]);

      await service.ensurePlayersFromField(tournament);

      expect(repo.find).toHaveBeenCalledWith({
        select: ['id', 'pga_player'],
        relations: ['pga_player'],
        where: { pga_tournament: { id: 'R2023006' } },
      });
      expect(repo.update).toHaveBeenCalledWith(['5678-R2023006'], {
        active: false,
        status: PlayerStatus.Withdrawn,
      });
      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining('Marked 1 stale player(s) as withdrawn')
      );
    });

    it('does NOT check stale rows for IN_PROGRESS tournaments', async () => {
      const { repo, pgaTourApi, pgaPlayerService, service } = createMocks();

      const tournament = {
        id: 'R2023006',
        tournament_status: PgaTournamentStatus.IN_PROGRESS,
      } as PgaTournament;

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [{ __typename: 'PlayerField', id: '1234', status: 'ACTIVE', withdrawn: false }],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([{ id: 1234 }] as never);

      await service.ensurePlayersFromField(tournament);

      expect(repo.find).not.toHaveBeenCalled();
    });

    it('does NOT check stale rows for COMPLETED tournaments', async () => {
      const { repo, pgaTourApi, pgaPlayerService, service } = createMocks();

      const tournament = {
        id: 'R2023006',
        tournament_status: PgaTournamentStatus.COMPLETED,
      } as PgaTournament;

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [{ __typename: 'PlayerField', id: '1234', status: 'ACTIVE', withdrawn: false }],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([{ id: 1234 }] as never);

      await service.ensurePlayersFromField(tournament);

      expect(repo.find).not.toHaveBeenCalled();
    });
  });

  describe('upsertFieldForTournament', () => {
    function createUpsertMocks() {
      const insertBuilder = {
        into: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        orIgnore: vi.fn().mockReturnThis(),
        execute: vi.fn().mockResolvedValue({}),
      } as unknown as InsertQueryBuilder<PgaTournamentPlayer>;

      const repo = {
        createQueryBuilder: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue(insertBuilder),
        }),
        find: vi.fn().mockResolvedValue([]),
        update: vi.fn().mockResolvedValue({}),
        upsert: vi.fn().mockResolvedValue({}),
      } as unknown as Repository<PgaTournamentPlayer>;

      const pgaTourApi = {
        getField: vi.fn(),
        getTournamentLeaderboard: vi.fn(),
        getProjectedFedexCupPoints: vi.fn(),
        getPlayerSeasonResults: vi.fn(),
      } as unknown as PgaTourApiService;

      const pgaPlayerService = {
        listByIds: vi.fn(),
      } as unknown as PgaPlayerService;

      const pgaTournamentService = {
        get: vi.fn(),
      } as unknown as PgaTournamentService;

      const eventBus = createEventBusMock();

      const logger = {
        warn: vi.fn(),
        error: vi.fn(),
        log: vi.fn(),
      } as unknown as LoggerService;

      const service = new PgaTournamentPlayerService(
        repo,
        pgaTourApi,
        pgaPlayerService,
        pgaTournamentService,
        eventBus,
        logger
      );

      return { repo, pgaTourApi, pgaPlayerService, pgaTournamentService, logger, service };
    }

    it('calls ensurePlayersFromField then updates scores from leaderboard', async () => {
      const { repo, pgaTourApi, pgaPlayerService, pgaTournamentService, service } =
        createUpsertMocks();

      const tournament = {
        id: 'R2023006',
        year: 2023,
        tournament_id: '006',
        tournament_status: PgaTournamentStatus.IN_PROGRESS,
      } as PgaTournament;

      vi.spyOn(pgaTournamentService, 'get').mockResolvedValue(tournament);

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [{ __typename: 'PlayerField', id: '1234', status: 'ACTIVE', withdrawn: false }],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([{ id: 1234 }] as never);

      const leaderboardResponse: PgaApiTournamentLeaderboardResponse = {
        leaderboardId: 'R2023006',
        leaderboard: {
          timezone: 'America/Los_Angeles',
          roundStatus: 'IN_PROGRESS',
          tournamentStatus: 'IN_PROGRESS',
          formatType: 'STROKE_PLAY',
          players: [
            {
              id: '01234',
              player: {
                firstName: 'Alpha',
                lastName: 'Player',
                displayName: 'Alpha Player',
              },
              scoringData: {
                playerState: 'ACTIVE',
                total: '-3',
                thruSort: 10,
                position: 'T1',
                thru: '10',
                score: '-1',
                scoreSort: -1,
                currentRound: 2,
                totalSort: -3,
                teeTime: -1,
                courseId: '1',
                groupNumber: 1,
                roundHeader: 'R2',
                roundStatus: 'R2 In Progress',
                totalStrokes: '69',
                oddsToWin: '+500',
              },
            },
          ],
        },
      };
      vi.spyOn(pgaTourApi, 'getTournamentLeaderboard').mockResolvedValue(leaderboardResponse);

      const projectedPointsResponse: PgaApiProjectedFedexCupPointsResponse = {
        seasonYear: 2023,
        lastUpdated: '2023-01-01T00:00:00Z',
        points: [],
      };
      vi.spyOn(pgaTourApi, 'getProjectedFedexCupPoints').mockResolvedValue(projectedPointsResponse);

      await service.upsertFieldForTournament(tournament.id, repo);

      // ensurePlayersFromField was called (via getField)
      expect(pgaTourApi.getField).toHaveBeenCalledWith('R2023006');
      // Leaderboard scoring was called
      expect(pgaTourApi.getTournamentLeaderboard).toHaveBeenCalledWith(2023, '006');
      expect(repo.upsert).toHaveBeenCalled();
    });

    it('still ensures field when leaderboard is not available', async () => {
      const { repo, pgaTourApi, pgaPlayerService, pgaTournamentService, logger, service } =
        createUpsertMocks();

      const tournament = {
        id: 'R2023006',
        year: 2023,
        tournament_id: '006',
        tournament_status: PgaTournamentStatus.NOT_STARTED,
      } as PgaTournament;

      vi.spyOn(pgaTournamentService, 'get').mockResolvedValue(tournament);

      vi.spyOn(pgaTourApi, 'getField').mockResolvedValue({
        __typename: 'Field',
        id: 'R2023006',
        tournamentName: 'Test',
        players: [{ __typename: 'PlayerField', id: '1234', status: 'ACTIVE', withdrawn: false }],
      });

      vi.spyOn(pgaPlayerService, 'listByIds').mockResolvedValue([{ id: 1234 }] as never);

      vi.spyOn(pgaTourApi, 'getTournamentLeaderboard').mockRejectedValue(
        new Error('Leaderboard not available')
      );

      await service.upsertFieldForTournament(tournament.id, repo);

      // ensurePlayersFromField was still called
      expect(pgaTourApi.getField).toHaveBeenCalledWith('R2023006');
      // Leaderboard was attempted but failed gracefully
      expect(pgaTourApi.getTournamentLeaderboard).toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Leaderboard not available')
      );
      // No score upsert since leaderboard failed
      expect(repo.upsert).not.toHaveBeenCalled();
    });
  });
});
