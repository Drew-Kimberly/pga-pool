import { Repository, SelectQueryBuilder } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';

import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentPlayerService } from '../../pga-tournament-player/lib/pga-tournament-player.service';

import { PgaTournamentPlayerHole } from './pga-tournament-player-hole.entity';
import { HoleScoreStatus } from './pga-tournament-player-hole.interface';
import { PgaTournamentPlayerHoleService } from './pga-tournament-player-hole.service';
import { PgaTournamentPlayerStroke } from './pga-tournament-player-stroke.entity';

import { LoggerService } from '@nestjs/common';

function createMocks() {
  const holeRepo = {
    upsert: vi.fn().mockResolvedValue({}),
    find: vi.fn().mockResolvedValue([]),
    createQueryBuilder: vi.fn(),
  } as unknown as Repository<PgaTournamentPlayerHole>;

  const strokeRepo = {
    upsert: vi.fn().mockResolvedValue({}),
  } as unknown as Repository<PgaTournamentPlayerStroke>;

  const pgaTourApi = {
    getLeaderboardHoleByHole: vi.fn(),
    getShotDetails: vi.fn(),
  } as unknown as PgaTourApiService;

  const pgaTournamentPlayerService = {
    list: vi.fn().mockResolvedValue([]),
  } as unknown as PgaTournamentPlayerService;

  const logger = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as LoggerService;

  const service = new PgaTournamentPlayerHoleService(
    holeRepo,
    strokeRepo,
    pgaTourApi,
    pgaTournamentPlayerService,
    logger
  );

  return { holeRepo, strokeRepo, pgaTourApi, pgaTournamentPlayerService, logger, service };
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

  describe('ingestStrokesForPlayer', () => {
    it('upserts stroke data from shotDetailsV3 API response', async () => {
      const { service, holeRepo, strokeRepo, pgaTourApi } = createMocks();

      vi.spyOn(holeRepo, 'find').mockResolvedValue([
        { id: 'hole-uuid-1', hole_number: 1, round_number: 1 } as PgaTournamentPlayerHole,
      ]);

      vi.spyOn(pgaTourApi, 'getShotDetails').mockResolvedValue({
        __typename: 'ShotDetails',
        id: 'test-id',
        tournamentId: 'R2025003',
        playerId: '46046',
        round: 1,
        displayType: 'ALL',
        groupPlayers: [],
        lineColor: '#000',
        message: '',
        holes: [
          {
            __typename: 'ShotDetailHole',
            holeNumber: 1,
            par: 4,
            score: '3',
            status: 'BIRDIE',
            yardage: 432,
            displayHoleNumber: '1',
            green: false,
            rank: null,
            fairwayCenter: {
              __typename: 'StrokeCoordinates',
              x: 0,
              y: 0,
              enhancedX: 0,
              enhancedY: 0,
              tourcastX: 0,
              tourcastY: 0,
              tourcastZ: 0,
            },
            pinGreen: { __typename: 'PointOfInterestCoords', x: 0, y: 0, z: 0 },
            pinOverview: { __typename: 'PointOfInterestCoords', x: 0, y: 0, z: 0 },
            teeGreen: { __typename: 'PointOfInterestCoords', x: 0, y: 0, z: 0 },
            teeOverview: { __typename: 'PointOfInterestCoords', x: 0, y: 0, z: 0 },
            holePickleBottomToTop: '',
            holePickleBottomToTopAsset: { __typename: 'ImageAsset', url: '' },
            holePickleGreenBottomToTop: '',
            holePickleGreenBottomToTopAsset: { __typename: 'ImageAsset', url: '' },
            holePickleGreenLeftToRight: '',
            holePickleGreenLeftToRightAsset: { __typename: 'ImageAsset', url: '' },
            holePickleLeftToRight: '',
            holePickleLeftToRightAsset: { __typename: 'ImageAsset', url: '' },
            enhancedPickle: null,
            strokes: [
              {
                __typename: 'HoleStroke',
                strokeNumber: 1,
                distance: '290 yds',
                distanceRemaining: '142 yds',
                fromLocation: 'Tee Box',
                fromLocationCode: 'TB',
                toLocation: 'Fairway',
                toLocationCode: 'FW',
                strokeType: 'STROKE',
                playByPlay: 'Drive to fairway',
                finalStroke: false,
                radarData: {
                  __typename: 'RadarData',
                  ballSpeed: 175.2,
                  clubSpeed: 120.1,
                  smashFactor: 1.459,
                  verticalLaunchAngle: 10.5,
                  launchSpin: 2800.0,
                  spinAxis: 5.2,
                  apexHeight: 115.0,
                  actualFlightTime: 0,
                  apexRange: 0,
                  apexSide: 0,
                  horizontalLaunchAngle: 0,
                  ballTrajectory: [],
                  normalizedTrajectory: [],
                  normalizedTrajectoryV2: [],
                  ballImpactMeasured: null,
                },
                overview: {
                  __typename: 'ShotLinkCoordWrapper',
                  bottomToTopCoords: {
                    __typename: 'ShotLinkCoordinates',
                    fromCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 100.5,
                      y: 200.3,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                    toCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 300.7,
                      y: 400.9,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                  },
                  leftToRightCoords: {
                    __typename: 'ShotLinkCoordinates',
                    fromCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                    toCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                  },
                },
                green: {
                  __typename: 'ShotLinkCoordWrapper',
                  bottomToTopCoords: {
                    __typename: 'ShotLinkCoordinates',
                    fromCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                    toCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                  },
                  leftToRightCoords: {
                    __typename: 'ShotLinkCoordinates',
                    fromCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                    toCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                  },
                },
                groupShowMarker: false,
                markerText: '',
                showMarker: false,
                ballPath: null,
                player: null,
                videoId: null,
              },
            ],
          },
        ],
      });

      await service.ingestStrokesForPlayer('R2025003', '46046', 1);

      expect(strokeRepo.upsert).toHaveBeenCalledTimes(1);

      const [rows, options] = (strokeRepo.upsert as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(options).toEqual({
        conflictPaths: ['pga_tournament_player_hole_id', 'stroke_number'],
      });
      expect(rows).toHaveLength(1);
      expect(rows[0]).toEqual({
        pga_tournament_player_hole_id: 'hole-uuid-1',
        stroke_number: 1,
        from_location: 'Tee Box',
        from_location_code: 'TB',
        to_location: 'Fairway',
        to_location_code: 'FW',
        stroke_type: 'stroke',
        distance: '290 yds',
        distance_remaining: '142 yds',
        play_by_play: 'Drive to fairway',
        is_final_stroke: false,
        ball_speed: 175.2,
        club_speed: 120.1,
        smash_factor: 1.459,
        launch_angle: 10.5,
        launch_spin: 2800.0,
        spin_axis: 5.2,
        apex_height: 115.0,
        start_x: 100.5,
        start_y: 200.3,
        end_x: 300.7,
        end_y: 400.9,
      });
    });

    it('skips holes without matching hole records', async () => {
      const { service, holeRepo, strokeRepo, pgaTourApi } = createMocks();

      vi.spyOn(holeRepo, 'find').mockResolvedValue([]);

      vi.spyOn(pgaTourApi, 'getShotDetails').mockResolvedValue({
        __typename: 'ShotDetails',
        id: 'test-id',
        tournamentId: 'R2025003',
        playerId: '46046',
        round: 1,
        displayType: 'ALL',
        groupPlayers: [],
        lineColor: '#000',
        message: '',
        holes: [
          {
            __typename: 'ShotDetailHole',
            holeNumber: 1,
            par: 4,
            score: '3',
            status: 'BIRDIE',
            yardage: 432,
            displayHoleNumber: '1',
            green: false,
            rank: null,
            fairwayCenter: {
              __typename: 'StrokeCoordinates',
              x: 0,
              y: 0,
              enhancedX: 0,
              enhancedY: 0,
              tourcastX: 0,
              tourcastY: 0,
              tourcastZ: 0,
            },
            pinGreen: { __typename: 'PointOfInterestCoords', x: 0, y: 0, z: 0 },
            pinOverview: { __typename: 'PointOfInterestCoords', x: 0, y: 0, z: 0 },
            teeGreen: { __typename: 'PointOfInterestCoords', x: 0, y: 0, z: 0 },
            teeOverview: { __typename: 'PointOfInterestCoords', x: 0, y: 0, z: 0 },
            holePickleBottomToTop: '',
            holePickleBottomToTopAsset: { __typename: 'ImageAsset', url: '' },
            holePickleGreenBottomToTop: '',
            holePickleGreenBottomToTopAsset: { __typename: 'ImageAsset', url: '' },
            holePickleGreenLeftToRight: '',
            holePickleGreenLeftToRightAsset: { __typename: 'ImageAsset', url: '' },
            holePickleLeftToRight: '',
            holePickleLeftToRightAsset: { __typename: 'ImageAsset', url: '' },
            enhancedPickle: null,
            strokes: [
              {
                __typename: 'HoleStroke',
                strokeNumber: 1,
                distance: '290 yds',
                distanceRemaining: '142 yds',
                fromLocation: 'Tee Box',
                fromLocationCode: 'TB',
                toLocation: 'Fairway',
                toLocationCode: 'FW',
                strokeType: 'STROKE',
                playByPlay: '',
                finalStroke: false,
                radarData: null,
                overview: {
                  __typename: 'ShotLinkCoordWrapper',
                  bottomToTopCoords: {
                    __typename: 'ShotLinkCoordinates',
                    fromCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                    toCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                  },
                  leftToRightCoords: {
                    __typename: 'ShotLinkCoordinates',
                    fromCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                    toCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                  },
                },
                green: {
                  __typename: 'ShotLinkCoordWrapper',
                  bottomToTopCoords: {
                    __typename: 'ShotLinkCoordinates',
                    fromCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                    toCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                  },
                  leftToRightCoords: {
                    __typename: 'ShotLinkCoordinates',
                    fromCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                    toCoords: {
                      __typename: 'StrokeCoordinates',
                      x: 0,
                      y: 0,
                      enhancedX: 0,
                      enhancedY: 0,
                      tourcastX: 0,
                      tourcastY: 0,
                      tourcastZ: 0,
                    },
                  },
                },
                groupShowMarker: false,
                markerText: '',
                showMarker: false,
                ballPath: null,
                player: null,
                videoId: null,
              },
            ],
          },
        ],
      });

      await service.ingestStrokesForPlayer('R2025003', '46046', 1);

      expect(strokeRepo.upsert).not.toHaveBeenCalled();
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
