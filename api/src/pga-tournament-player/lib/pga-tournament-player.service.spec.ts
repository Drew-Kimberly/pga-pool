import { Repository } from 'typeorm';

import { PgaPlayerService } from '../../pga-player/lib/pga-player.service';
import {
  PgaApiProjectedFedexCupPointsResponse,
  PgaApiTournamentLeaderboardResponse,
} from '../../pga-tour-api/lib/v2/pga-tour-api.interface';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';

import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PlayerStatus } from './pga-tournament-player.interface';
import { PgaTournamentPlayerService } from './pga-tournament-player.service';

import { LoggerService } from '@nestjs/common';

describe('PgaTournamentPlayerService', () => {
  describe('updateScores', () => {
    it('upserts updated leaderboard data in bulk', async () => {
      const repo = {
        upsert: jest.fn().mockResolvedValue({}),
      } as unknown as Repository<PgaTournamentPlayer>;
      const pgaTourApi = {
        getTournamentLeaderboard: jest.fn(),
        getProjectedFedexCupPoints: jest.fn(),
      } as unknown as PgaTourApiService;
      const pgaPlayerService = {
        save: jest.fn(),
      } as unknown as PgaPlayerService;
      const pgaTournamentService = {
        get: jest.fn(),
      } as unknown as PgaTournamentService;
      const logger = {
        warn: jest.fn(),
        error: jest.fn(),
        log: jest.fn(),
      } as unknown as LoggerService;

      const service = new PgaTournamentPlayerService(
        repo,
        pgaTourApi,
        pgaPlayerService,
        pgaTournamentService,
        logger
      );

      const tournament: Partial<PgaTournament> = {
        id: 'R2023006',
        year: 2023,
        name: 'Test Tournament',
        tournament_id: '006',
      };
      jest.spyOn(pgaTournamentService, 'get').mockResolvedValue(tournament as PgaTournament);

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
      jest.spyOn(pgaTourApi, 'getTournamentLeaderboard').mockResolvedValue(leaderboardResponse);

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
      jest
        .spyOn(pgaTourApi, 'getProjectedFedexCupPoints')
        .mockResolvedValue(projectedPointsResponse);

      await service.updateScores(tournament.id!, repo);

      expect(repo.upsert).toHaveBeenCalledTimes(1);
      expect(pgaTourApi.getProjectedFedexCupPoints).toHaveBeenCalledWith(2023, '006');
      const [updatesArg, conflict] = (repo.upsert as jest.Mock).mock.calls[0];
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
  });
});
