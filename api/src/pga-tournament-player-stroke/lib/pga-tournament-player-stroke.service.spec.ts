import { Repository } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';

import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentPlayerHole } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.entity';

import { PgaTournamentPlayerStroke } from './pga-tournament-player-stroke.entity';
import { StrokeType } from './pga-tournament-player-stroke.interface';
import { PgaTournamentPlayerStrokeService } from './pga-tournament-player-stroke.service';

import { LoggerService } from '@nestjs/common';

function createMocks() {
  const strokeRepo = {
    upsert: vi.fn().mockResolvedValue({}),
  } as unknown as Repository<PgaTournamentPlayerStroke>;

  const holeRepo = {
    find: vi.fn().mockResolvedValue([]),
  } as unknown as Repository<PgaTournamentPlayerHole>;

  const pgaTourApi = {
    getShotDetails: vi.fn(),
  } as unknown as PgaTourApiService;

  const logger = {
    log: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as LoggerService;

  const service = new PgaTournamentPlayerStrokeService(strokeRepo, holeRepo, pgaTourApi, logger);

  return { strokeRepo, holeRepo, pgaTourApi, logger, service };
}

function createShotDetailHoleStub(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'ShotDetailHole' as const,
    displayHoleNumber: '1',
    green: false,
    rank: null,
    fairwayCenter: {
      __typename: 'StrokeCoordinates' as const,
      x: 0,
      y: 0,
      enhancedX: 0,
      enhancedY: 0,
      tourcastX: 0,
      tourcastY: 0,
      tourcastZ: 0,
    },
    pinGreen: { __typename: 'PointOfInterestCoords' as const, x: 0, y: 0, z: 0 },
    pinOverview: { __typename: 'PointOfInterestCoords' as const, x: 0, y: 0, z: 0 },
    teeGreen: { __typename: 'PointOfInterestCoords' as const, x: 0, y: 0, z: 0 },
    teeOverview: { __typename: 'PointOfInterestCoords' as const, x: 0, y: 0, z: 0 },
    holePickleBottomToTop: '',
    holePickleBottomToTopAsset: { __typename: 'ImageAsset' as const, url: '' },
    holePickleGreenBottomToTop: '',
    holePickleGreenBottomToTopAsset: { __typename: 'ImageAsset' as const, url: '' },
    holePickleGreenLeftToRight: '',
    holePickleGreenLeftToRightAsset: { __typename: 'ImageAsset' as const, url: '' },
    holePickleLeftToRight: '',
    holePickleLeftToRightAsset: { __typename: 'ImageAsset' as const, url: '' },
    enhancedPickle: null,
    ...overrides,
  };
}

function createCoordStub(x = 0, y = 0) {
  return {
    __typename: 'StrokeCoordinates' as const,
    x,
    y,
    enhancedX: 0,
    enhancedY: 0,
    tourcastX: 0,
    tourcastY: 0,
    tourcastZ: 0,
  };
}

function createShotLinkCoordWrapperStub(fromX = 0, fromY = 0, toX = 0, toY = 0) {
  return {
    __typename: 'ShotLinkCoordWrapper' as const,
    bottomToTopCoords: {
      __typename: 'ShotLinkCoordinates' as const,
      fromCoords: createCoordStub(fromX, fromY),
      toCoords: createCoordStub(toX, toY),
    },
    leftToRightCoords: {
      __typename: 'ShotLinkCoordinates' as const,
      fromCoords: createCoordStub(),
      toCoords: createCoordStub(),
    },
  };
}

describe('PgaTournamentPlayerStrokeService', () => {
  describe('mapStrokeType', () => {
    it('maps GraphQL STROKE to entity stroke', () => {
      const { service } = createMocks();
      expect(service.mapStrokeType('STROKE')).toBe(StrokeType.Stroke);
    });

    it('maps GraphQL PENALTY to entity penalty', () => {
      const { service } = createMocks();
      expect(service.mapStrokeType('PENALTY')).toBe(StrokeType.Penalty);
    });

    it('maps GraphQL DROP to entity drop', () => {
      const { service } = createMocks();
      expect(service.mapStrokeType('DROP')).toBe(StrokeType.Drop);
    });

    it('maps GraphQL PROVISIONAL to entity provisional', () => {
      const { service } = createMocks();
      expect(service.mapStrokeType('PROVISIONAL')).toBe(StrokeType.Provisional);
    });

    it('maps unknown values to stroke', () => {
      const { service } = createMocks();
      expect(service.mapStrokeType('UNKNOWN')).toBe(StrokeType.Stroke);
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
          createShotDetailHoleStub({
            holeNumber: 1,
            par: 4,
            score: '3',
            status: 'BIRDIE',
            yardage: 432,
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
                overview: createShotLinkCoordWrapperStub(100.5, 200.3, 300.7, 400.9),
                green: createShotLinkCoordWrapperStub(),
                groupShowMarker: false,
                markerText: '',
                showMarker: false,
                ballPath: null,
                player: null,
                videoId: null,
              },
            ],
          }),
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
          createShotDetailHoleStub({
            holeNumber: 1,
            par: 4,
            score: '3',
            status: 'BIRDIE',
            yardage: 432,
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
                overview: createShotLinkCoordWrapperStub(),
                green: createShotLinkCoordWrapperStub(),
                groupShowMarker: false,
                markerText: '',
                showMarker: false,
                ballPath: null,
                player: null,
                videoId: null,
              },
            ],
          }),
        ],
      });

      await service.ingestStrokesForPlayer('R2025003', '46046', 1);

      expect(strokeRepo.upsert).not.toHaveBeenCalled();
    });
  });
});
