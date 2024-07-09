import { FindOptionsWhere, Repository } from 'typeorm';

import { NullStringValue } from '../../pga-tour-api/lib/v2/pga-tour-api.constants';
import {
  PgaApiProjectedPlayerPoints,
  PgaApiTournamentLeaderboardRow,
} from '../../pga-tour-api/lib/v2/pga-tour-api.interface';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';

import { PgaTournamentPlayer } from './pga-tournament-player.entity';
import { PgaTournamentPlayerFilter, PlayerStatus } from './pga-tournament-player.interface';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaTournamentPlayerService {
  constructor(
    @InjectRepository(PgaTournamentPlayer)
    private readonly tourneyPlayerRepo: Repository<PgaTournamentPlayer>,
    private readonly pgaTourApi: PgaTourApiService,
    private readonly pgaTournamentService: PgaTournamentService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentPlayerService.name)
  ) {}

  list(
    filter: PgaTournamentPlayerFilter,
    repo: Repository<PgaTournamentPlayer> = this.tourneyPlayerRepo
  ): Promise<PgaTournamentPlayer[]> {
    const findOptions: FindOptionsWhere<PgaTournamentPlayer> = {
      ...(filter.tournamentId ? { pga_tournament: { id: filter.tournamentId } } : {}),
      ...(filter.playerId ? { pga_player: { id: filter.playerId } } : {}),
      ...(filter.year ? { pga_tournament: { year: filter.year } } : {}),
    };

    return repo.find({
      where: findOptions,
      relations: ['pga_tournament', 'pga_player'],
      order: {
        pga_tournament: { year: 'DESC', start_date: 'DESC' },
        score_total: 'DESC',
      },
    });
  }

  get(
    pgaTournamentPlayerId: string,
    repo: Repository<PgaTournamentPlayer> = this.tourneyPlayerRepo
  ): Promise<PgaTournamentPlayer | null> {
    return repo.findOneBy({ id: pgaTournamentPlayerId });
  }

  upsert(
    pgaTournamentPlayer: PgaTournamentPlayer,
    repo: Repository<PgaTournamentPlayer> = this.tourneyPlayerRepo
  ): Promise<PgaTournamentPlayer> {
    return repo.save(pgaTournamentPlayer);
  }

  async updateScores(
    pgaTournamentId: string,
    repo: Repository<PgaTournamentPlayer> = this.tourneyPlayerRepo
  ) {
    const updateBatchSize = 25;

    const pgaTournament = await this.pgaTournamentService.get(pgaTournamentId);
    if (!pgaTournament) {
      throw new Error(`PGA Tournament ${pgaTournamentId} does not exist`);
    }

    const players = await this.list({ tournamentId: pgaTournament.id }, repo);
    const pgaLeaderboard = await this.pgaTourApi.getTournamentLeaderboard(
      pgaTournament.year,
      pgaTournament.tournament_id
    );
    const projectedFedexPoints = await this.tryGetProjectedFedexCupPoints(pgaTournament.id);

    for (let i = 0; i < players.length; i += updateBatchSize) {
      const batch = players.slice(i, i + updateBatchSize);
      const updates = batch.map((player) => {
        const leaderboardEntry = pgaLeaderboard.leaderboard.players.find(
          (r) => r.id === this.coercePgaPlayerId(player.pga_player.id.toString())
        );

        if (!leaderboardEntry) {
          this.logger.warn(
            `No ${pgaTournament.year} ${pgaTournament.name} Leaderboard row found for PGA Player ${player.pga_player.name} (ID: ${player.pga_player.id}). Marking as cut...`
          );

          return this.upsert({
            ...player,
            active: false,
            current_hole: null,
            current_position: null,
            current_round: null,
            is_round_complete: true,
            score_thru: null,
            score_total: player.score_total,
            starting_hole: player.starting_hole,
            status: PlayerStatus.Cut,
            tee_time: null,
            projected_fedex_cup_points: this.coerceFedexCupPoints(
              projectedFedexPoints[player.pga_player.id]?.projectedEventPoints
            ),
          });
        }

        return this.upsert(
          {
            ...player,
            active: leaderboardEntry.scoringData.playerState === 'ACTIVE',
            current_hole:
              leaderboardEntry.scoringData.thruSort >= 18
                ? null
                : leaderboardEntry.scoringData.thruSort + 1,
            current_position:
              leaderboardEntry.scoringData.position === NullStringValue
                ? null
                : leaderboardEntry.scoringData.position,
            current_round: leaderboardEntry.scoringData.currentRound,
            is_round_complete: leaderboardEntry.scoringData.thruSort >= 18,
            score_thru: Math.min(18, leaderboardEntry.scoringData.thruSort),
            score_total: leaderboardEntry.scoringData.totalSort,
            status: this.coercePlayerStatus(leaderboardEntry.scoringData.playerState),
            tee_time:
              leaderboardEntry.scoringData.teeTime === -1
                ? null
                : leaderboardEntry.scoringData.teeTime,
            projected_fedex_cup_points: this.coerceFedexCupPoints(
              projectedFedexPoints[player.pga_player.id]?.projectedEventPoints
            ),
          },
          repo
        );
      });

      await Promise.all(updates);
    }
  }

  private async tryGetProjectedFedexCupPoints(pgaTournamentId: string) {
    let points: PgaApiProjectedPlayerPoints[];
    try {
      points = await this.pgaTourApi.getProjectedFedexCupPoints().then((r) => r.points);
    } catch (e) {
      this.logger.error(
        `Error fetching projected FedEx Cup points from PGA Tour API: ${e}`,
        e.stack
      );
      return {};
    }

    const playerPointMap: Record<number, PgaApiProjectedPlayerPoints> = {};

    for (const playerPoints of points) {
      if (playerPoints.tournamentId === this.toProjectedPointTournamentId(pgaTournamentId)) {
        playerPointMap[Number(playerPoints.playerId)] = playerPoints;
      }
    }

    return playerPointMap;
  }

  private coercePlayerStatus(
    val: PgaApiTournamentLeaderboardRow['scoringData']['playerState']
  ): PlayerStatus {
    const map: Record<PgaApiTournamentLeaderboardRow['scoringData']['playerState'], PlayerStatus> =
      {
        ACTIVE: PlayerStatus.Active,
      };

    return map[val];
  }

  private coercePgaPlayerId(id: string) {
    if (id.length === 4) {
      return `0${id}`;
    }

    return id;
  }

  private toProjectedPointTournamentId(tournamentId: string): string {
    const [tourneyId, year] = tournamentId.split('-');
    return `R${year}${tourneyId}`;
  }

  private coerceFedexCupPoints(points: string): number {
    return !isNaN(Number(points)) ? Number(points) : 0;
  }
}
