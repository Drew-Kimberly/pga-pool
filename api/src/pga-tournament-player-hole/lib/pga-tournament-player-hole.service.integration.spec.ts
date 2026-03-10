import { DataSource } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  createPgaPlayer,
  createPgaTournament,
  createPgaTournamentPlayer,
  createPgaTournamentPlayerHole,
} from '../../../test-helpers/factories';
import { setupTestApp } from '../../../test-helpers/setup-test-app';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentPlayerStrokeService } from '../../pga-tournament-player-stroke/lib/pga-tournament-player-stroke.service';

import { PgaTournamentPlayerHole } from './pga-tournament-player-hole.entity';
import { HoleScoreStatus } from './pga-tournament-player-hole.interface';
import { PgaTournamentPlayerHoleService } from './pga-tournament-player-hole.service';

import { INestApplication } from '@nestjs/common';

describe('PgaTournamentPlayerHoleService (integration)', () => {
  let app: INestApplication;
  let ds: DataSource;
  let service: PgaTournamentPlayerHoleService;
  let mockPgaTourApi: Record<string, ReturnType<typeof vi.fn>>;

  beforeAll(async () => {
    // Override stroke service to avoid stroke API calls; tests focus on holes
    const mockStrokeService = { ingestStrokesForPlayer: vi.fn().mockResolvedValue(undefined) };

    const moduleRef = await setupTestApp()
      .overrideProvider(PgaTournamentPlayerStrokeService)
      .useValue(mockStrokeService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    ds = moduleRef.get(DataSource);
    service = moduleRef.get(PgaTournamentPlayerHoleService);
    mockPgaTourApi = moduleRef.get(PgaTourApiService);
  });

  afterAll(async () => {
    await app?.close();
  });

  describe('ingestHolesForRound', () => {
    it('upserts hole records from API response', async () => {
      const pgaTournament = await createPgaTournament(ds);
      const player = await createPgaPlayer(ds);
      await createPgaTournamentPlayer(ds, {
        pgaPlayer: player,
        pgaTournament,
      });

      mockPgaTourApi.getLeaderboardHoleByHole.mockResolvedValueOnce({
        __typename: 'LeaderboardHoleByHole',
        tournamentId: pgaTournament.id,
        tournamentName: pgaTournament.name,
        currentRound: 1,
        courseHoleHeaders: [],
        courses: [],
        rounds: [],
        holeHeaders: [],
        playerData: [
          {
            __typename: 'PlayerRowHoleByHole',
            playerId: String(player.id),
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

      await service.ingestHolesForRound(pgaTournament.id, 1);

      const holes = await ds.getRepository(PgaTournamentPlayerHole).find({
        where: { pga_tournament_player_id: `${player.id}-${pgaTournament.id}` },
        order: { hole_number: 'ASC' },
      });
      expect(holes).toHaveLength(2);
      expect(holes[0].hole_number).toBe(1);
      expect(holes[0].par).toBe(4);
      expect(holes[0].score).toBe(3);
      expect(holes[0].to_par).toBe(-1);
      expect(holes[0].status).toBe(HoleScoreStatus.Birdie);
      expect(holes[0].yardage).toBe(432);
      expect(holes[1].hole_number).toBe(2);
    });

    it('skips players not in pga_tournament_player table', async () => {
      const pgaTournament = await createPgaTournament(ds);

      // Player 99999 does not exist in pga_tournament_player
      mockPgaTourApi.getLeaderboardHoleByHole.mockResolvedValueOnce({
        __typename: 'LeaderboardHoleByHole',
        tournamentId: pgaTournament.id,
        tournamentName: pgaTournament.name,
        currentRound: 1,
        courseHoleHeaders: [],
        courses: [],
        rounds: [],
        holeHeaders: [],
        playerData: [
          {
            __typename: 'PlayerRowHoleByHole',
            playerId: '99999',
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
            ],
          },
        ],
      });

      await service.ingestHolesForRound(pgaTournament.id, 1);

      // No holes should have been inserted for this tournament
      const holes = await ds
        .getRepository(PgaTournamentPlayerHole)
        .createQueryBuilder('hole')
        .innerJoin('hole.pga_tournament_player', 'tp')
        .where('tp.pga_tournament = :tid', { tid: pgaTournament.id })
        .getMany();
      expect(holes).toHaveLength(0);
    });

    it('upsert-on-conflict updates existing holes', async () => {
      const pgaTournament = await createPgaTournament(ds);
      const player = await createPgaPlayer(ds);
      const tp = await createPgaTournamentPlayer(ds, {
        pgaPlayer: player,
        pgaTournament,
      });

      // Insert initial hole data
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: {
          round_number: 1,
          hole_number: 1,
          par: 4,
          score: 4,
          to_par: 0,
          status: HoleScoreStatus.Par,
          yardage: 432,
          sequence: 1,
        },
      });

      // Now ingest updated data — score changed from 4 to 3
      mockPgaTourApi.getLeaderboardHoleByHole.mockResolvedValueOnce({
        __typename: 'LeaderboardHoleByHole',
        tournamentId: pgaTournament.id,
        tournamentName: pgaTournament.name,
        currentRound: 1,
        courseHoleHeaders: [],
        courses: [],
        rounds: [],
        holeHeaders: [],
        playerData: [
          {
            __typename: 'PlayerRowHoleByHole',
            playerId: String(player.id),
            courseId: '1',
            courseCode: 'TPC',
            in: null,
            out: null,
            total: null,
            totalToPar: '-1',
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
            ],
          },
        ],
      });

      await service.ingestHolesForRound(pgaTournament.id, 1);

      const holes = await ds.getRepository(PgaTournamentPlayerHole).find({
        where: {
          pga_tournament_player_id: tp.id,
          round_number: 1,
          hole_number: 1,
        },
      });
      expect(holes).toHaveLength(1);
      expect(holes[0].score).toBe(3);
      expect(holes[0].status).toBe(HoleScoreStatus.Birdie);
    });
  });

  describe('getRoundSummaries', () => {
    it('returns correct GROUP BY aggregates', async () => {
      const pgaTournament = await createPgaTournament(ds);
      const player = await createPgaPlayer(ds);
      const tp = await createPgaTournamentPlayer(ds, {
        pgaPlayer: player,
        pgaTournament,
      });

      // Round 1: holes 1-3 with specific scores
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: { round_number: 1, hole_number: 1, score: 3, to_par: -1, par: 4, sequence: 1 },
      });
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: { round_number: 1, hole_number: 2, score: 4, to_par: 0, par: 4, sequence: 2 },
      });
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: { round_number: 1, hole_number: 3, score: 5, to_par: 1, par: 4, sequence: 3 },
      });

      // Round 2: 2 holes
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: { round_number: 2, hole_number: 1, score: 2, to_par: -2, par: 4, sequence: 1 },
      });
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: { round_number: 2, hole_number: 2, score: 4, to_par: 0, par: 4, sequence: 2 },
      });

      const summaries = await service.getRoundSummaries(tp.id);

      expect(summaries).toHaveLength(2);
      expect(summaries[0]).toEqual({ round_number: 1, strokes: 12, to_par: 0 });
      expect(summaries[1]).toEqual({ round_number: 2, strokes: 6, to_par: -2 });
    });
  });

  describe('getRoundSummariesBatch', () => {
    it('groups round summaries across multiple players', async () => {
      const pgaTournament = await createPgaTournament(ds);
      const player1 = await createPgaPlayer(ds);
      const player2 = await createPgaPlayer(ds);
      const tp1 = await createPgaTournamentPlayer(ds, {
        pgaPlayer: player1,
        pgaTournament,
      });
      const tp2 = await createPgaTournamentPlayer(ds, {
        pgaPlayer: player2,
        pgaTournament,
      });

      // Player 1, round 1
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp1,
        overrides: { round_number: 1, hole_number: 1, score: 3, to_par: -1, par: 4, sequence: 1 },
      });
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp1,
        overrides: { round_number: 1, hole_number: 2, score: 5, to_par: 1, par: 4, sequence: 2 },
      });

      // Player 2, round 1
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp2,
        overrides: { round_number: 1, hole_number: 1, score: 4, to_par: 0, par: 4, sequence: 1 },
      });

      const result = await service.getRoundSummariesBatch([tp1.id, tp2.id]);

      expect(result.size).toBe(2);
      expect(result.get(tp1.id)).toEqual([{ round_number: 1, strokes: 8, to_par: 0 }]);
      expect(result.get(tp2.id)).toEqual([{ round_number: 1, strokes: 4, to_par: 0 }]);
    });
  });

  describe('getScorecard', () => {
    it('returns ordered holes per round', async () => {
      const pgaTournament = await createPgaTournament(ds);
      const player = await createPgaPlayer(ds);
      const tp = await createPgaTournamentPlayer(ds, {
        pgaPlayer: player,
        pgaTournament,
      });

      // Insert holes out of order
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: {
          round_number: 1,
          hole_number: 3,
          score: 5,
          to_par: 1,
          par: 4,
          yardage: 220,
          sequence: 3,
        },
      });
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: {
          round_number: 1,
          hole_number: 1,
          score: 3,
          to_par: -1,
          par: 4,
          yardage: 432,
          sequence: 1,
        },
      });
      await createPgaTournamentPlayerHole(ds, {
        pgaTournamentPlayer: tp,
        overrides: {
          round_number: 1,
          hole_number: 2,
          score: 4,
          to_par: 0,
          par: 4,
          yardage: 195,
          sequence: 2,
        },
      });

      const scorecard = await service.getScorecard(tp.id, 1);

      expect(scorecard).toHaveLength(3);
      expect(scorecard[0].hole_number).toBe(1);
      expect(scorecard[1].hole_number).toBe(2);
      expect(scorecard[2].hole_number).toBe(3);
    });
  });
});
