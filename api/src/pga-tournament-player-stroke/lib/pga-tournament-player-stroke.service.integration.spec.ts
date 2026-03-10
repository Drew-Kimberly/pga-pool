import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  createPgaPlayer,
  createPgaTournament,
  createPgaTournamentPlayer,
  createPgaTournamentPlayerHole,
} from '../../../test-helpers/factories';
import { MockPgaTourApiService, setupTestApp } from '../../../test-helpers/setup-test-app';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';

import { PgaTournamentPlayerStroke } from './pga-tournament-player-stroke.entity';
import { StrokeType } from './pga-tournament-player-stroke.interface';
import { PgaTournamentPlayerStrokeService } from './pga-tournament-player-stroke.service';

import { INestApplication } from '@nestjs/common';

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

function makeStroke(overrides: Record<string, unknown> = {}) {
  return {
    __typename: 'HoleStroke' as const,
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
    radarData: null,
    overview: createShotLinkCoordWrapperStub(),
    green: createShotLinkCoordWrapperStub(),
    groupShowMarker: false,
    markerText: '',
    showMarker: false,
    ballPath: null,
    player: null,
    videoId: null,
    ...overrides,
  };
}

function makeShotDetailsResponse(
  tournamentId: string,
  playerId: string,
  round: number,
  holes: unknown[]
) {
  return {
    __typename: 'ShotDetails' as const,
    id: 'test-id',
    tournamentId,
    playerId,
    round,
    displayType: 'ALL',
    groupPlayers: [],
    lineColor: '#000',
    message: '',
    holes,
  };
}

describe('PgaTournamentPlayerStrokeService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let strokeService: PgaTournamentPlayerStrokeService;
  let mockPgaTourApi: MockPgaTourApiService;

  beforeAll(async () => {
    const moduleRef = await setupTestApp().compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    strokeService = moduleRef.get(PgaTournamentPlayerStrokeService);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
  });

  afterAll(async () => {
    await app?.close();
  });

  it('upserts stroke data from API response and persists to DB', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pgaPlayer = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, { pgaPlayer, pgaTournament });
    const hole = await createPgaTournamentPlayerHole(ds, {
      pgaTournamentPlayer: tp,
      overrides: { round_number: 1, hole_number: 1 },
    });

    mockPgaTourApi.getShotDetails.mockResolvedValueOnce(
      makeShotDetailsResponse(pgaTournament.id, String(pgaPlayer.id), 1, [
        createShotDetailHoleStub({
          holeNumber: 1,
          par: 4,
          score: '3',
          status: 'BIRDIE',
          yardage: 432,
          strokes: [
            makeStroke({
              strokeNumber: 1,
              fromLocation: 'Tee Box',
              toLocation: 'Fairway',
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
            }),
            makeStroke({
              strokeNumber: 2,
              fromLocation: 'Fairway',
              toLocation: 'Green',
              finalStroke: false,
            }),
            makeStroke({
              strokeNumber: 3,
              fromLocation: 'Green',
              toLocation: 'Hole',
              finalStroke: true,
            }),
          ],
        }),
      ])
    );

    await strokeService.ingestStrokesForPlayer(pgaTournament.id, String(pgaPlayer.id), 1);

    const strokes = await ds.getRepository(PgaTournamentPlayerStroke).find({
      where: { pga_tournament_player_hole_id: hole.id },
      order: { stroke_number: 'ASC' },
    });

    expect(strokes).toHaveLength(3);

    // Verify first stroke with radar data
    expect(strokes[0].stroke_number).toBe(1);
    expect(strokes[0].from_location).toBe('Tee Box');
    expect(strokes[0].to_location).toBe('Fairway');
    expect(strokes[0].stroke_type).toBe(StrokeType.Stroke);
    expect(strokes[0].ball_speed).toBe(175.2);
    expect(strokes[0].club_speed).toBe(120.1);
    expect(strokes[0].smash_factor).toBe(1.459);
    expect(strokes[0].launch_angle).toBe(10.5);
    expect(strokes[0].apex_height).toBe(115.0);
    expect(strokes[0].start_x).toBe(100.5);
    expect(strokes[0].start_y).toBe(200.3);
    expect(strokes[0].end_x).toBe(300.7);
    expect(strokes[0].end_y).toBe(400.9);
    expect(strokes[0].is_final_stroke).toBe(false);

    // Verify final stroke
    expect(strokes[2].stroke_number).toBe(3);
    expect(strokes[2].from_location).toBe('Green');
    expect(strokes[2].to_location).toBe('Hole');
    expect(strokes[2].is_final_stroke).toBe(true);
  });

  it('updates existing strokes on re-ingest (upsert conflict)', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pgaPlayer = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, { pgaPlayer, pgaTournament });
    const hole = await createPgaTournamentPlayerHole(ds, {
      pgaTournamentPlayer: tp,
      overrides: { round_number: 1, hole_number: 1 },
    });

    // First ingest
    mockPgaTourApi.getShotDetails.mockResolvedValueOnce(
      makeShotDetailsResponse(pgaTournament.id, String(pgaPlayer.id), 1, [
        createShotDetailHoleStub({
          holeNumber: 1,
          par: 4,
          score: '4',
          status: 'PAR',
          yardage: 400,
          strokes: [makeStroke({ strokeNumber: 1, toLocation: 'Rough' })],
        }),
      ])
    );
    await strokeService.ingestStrokesForPlayer(pgaTournament.id, String(pgaPlayer.id), 1);

    // Second ingest — different toLocation
    mockPgaTourApi.getShotDetails.mockResolvedValueOnce(
      makeShotDetailsResponse(pgaTournament.id, String(pgaPlayer.id), 1, [
        createShotDetailHoleStub({
          holeNumber: 1,
          par: 4,
          score: '4',
          status: 'PAR',
          yardage: 400,
          strokes: [makeStroke({ strokeNumber: 1, toLocation: 'Fairway' })],
        }),
      ])
    );
    await strokeService.ingestStrokesForPlayer(pgaTournament.id, String(pgaPlayer.id), 1);

    const strokes = await ds
      .getRepository(PgaTournamentPlayerStroke)
      .find({ where: { pga_tournament_player_hole_id: hole.id } });

    expect(strokes).toHaveLength(1);
    expect(strokes[0].to_location).toBe('Fairway');
  });

  it('deduplicates strokes with same hole and stroke number (last wins)', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pgaPlayer = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, { pgaPlayer, pgaTournament });
    const hole = await createPgaTournamentPlayerHole(ds, {
      pgaTournamentPlayer: tp,
      overrides: { round_number: 1, hole_number: 1 },
    });

    mockPgaTourApi.getShotDetails.mockResolvedValueOnce(
      makeShotDetailsResponse(pgaTournament.id, String(pgaPlayer.id), 1, [
        createShotDetailHoleStub({
          holeNumber: 1,
          par: 4,
          score: '4',
          status: 'PAR',
          yardage: 400,
          strokes: [
            makeStroke({ strokeNumber: 1, toLocation: 'Fairway' }),
            makeStroke({ strokeNumber: 1, toLocation: 'Rough' }),
          ],
        }),
      ])
    );

    await strokeService.ingestStrokesForPlayer(pgaTournament.id, String(pgaPlayer.id), 1);

    const strokes = await ds
      .getRepository(PgaTournamentPlayerStroke)
      .find({ where: { pga_tournament_player_hole_id: hole.id } });

    expect(strokes).toHaveLength(1);
    expect(strokes[0].to_location).toBe('Rough');
  });

  it('skips holes without matching hole records', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pgaPlayer = await createPgaPlayer(ds);
    await createPgaTournamentPlayer(ds, { pgaPlayer, pgaTournament });
    // No hole created for hole_number 5

    mockPgaTourApi.getShotDetails.mockResolvedValueOnce(
      makeShotDetailsResponse(pgaTournament.id, String(pgaPlayer.id), 1, [
        createShotDetailHoleStub({
          holeNumber: 5,
          par: 3,
          score: '3',
          status: 'PAR',
          yardage: 200,
          strokes: [makeStroke({ strokeNumber: 1 })],
        }),
      ])
    );

    // Should not throw — the service silently skips holes without matching records
    await strokeService.ingestStrokesForPlayer(pgaTournament.id, String(pgaPlayer.id), 1);
  });

  it('stores null radar data when radarData is absent', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pgaPlayer = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, { pgaPlayer, pgaTournament });
    const hole = await createPgaTournamentPlayerHole(ds, {
      pgaTournamentPlayer: tp,
      overrides: { round_number: 1, hole_number: 1 },
    });

    mockPgaTourApi.getShotDetails.mockResolvedValueOnce(
      makeShotDetailsResponse(pgaTournament.id, String(pgaPlayer.id), 1, [
        createShotDetailHoleStub({
          holeNumber: 1,
          par: 4,
          score: '4',
          status: 'PAR',
          yardage: 400,
          strokes: [makeStroke({ strokeNumber: 1, radarData: null })],
        }),
      ])
    );

    await strokeService.ingestStrokesForPlayer(pgaTournament.id, String(pgaPlayer.id), 1);

    const strokes = await ds
      .getRepository(PgaTournamentPlayerStroke)
      .find({ where: { pga_tournament_player_hole_id: hole.id } });

    expect(strokes).toHaveLength(1);
    // Nullable transformer correctly preserves null for absent radar data
    expect(strokes[0].ball_speed).toBeNull();
    expect(strokes[0].club_speed).toBeNull();
    expect(strokes[0].smash_factor).toBeNull();
    expect(strokes[0].launch_angle).toBeNull();
    expect(strokes[0].apex_height).toBeNull();
  });

  it('maps PENALTY stroke type correctly', async () => {
    const pgaTournament = await createPgaTournament(ds);
    const pgaPlayer = await createPgaPlayer(ds);
    const tp = await createPgaTournamentPlayer(ds, { pgaPlayer, pgaTournament });
    const hole = await createPgaTournamentPlayerHole(ds, {
      pgaTournamentPlayer: tp,
      overrides: { round_number: 1, hole_number: 1 },
    });

    mockPgaTourApi.getShotDetails.mockResolvedValueOnce(
      makeShotDetailsResponse(pgaTournament.id, String(pgaPlayer.id), 1, [
        createShotDetailHoleStub({
          holeNumber: 1,
          par: 5,
          score: '7',
          status: 'DOUBLE_BOGEY',
          yardage: 560,
          strokes: [
            makeStroke({ strokeNumber: 1, strokeType: 'STROKE' }),
            makeStroke({
              strokeNumber: 2,
              strokeType: 'PENALTY',
              fromLocation: 'Water',
              toLocation: 'Drop Zone',
            }),
            makeStroke({
              strokeNumber: 3,
              strokeType: 'DROP',
              fromLocation: 'Drop Zone',
              toLocation: 'Drop Zone',
            }),
          ],
        }),
      ])
    );

    await strokeService.ingestStrokesForPlayer(pgaTournament.id, String(pgaPlayer.id), 1);

    const strokes = await ds.getRepository(PgaTournamentPlayerStroke).find({
      where: { pga_tournament_player_hole_id: hole.id },
      order: { stroke_number: 'ASC' },
    });

    expect(strokes).toHaveLength(3);
    expect(strokes[0].stroke_type).toBe(StrokeType.Stroke);
    expect(strokes[1].stroke_type).toBe(StrokeType.Penalty);
    expect(strokes[2].stroke_type).toBe(StrokeType.Drop);
  });
});
