import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';

import { IListParams, PaginatedCollection } from '../../common/api/list';
import { DeepPartial } from '../../common/types';
import { PgaPlayerService } from '../../pga-player/lib/pga-player.service';
import { NullStringValue } from '../../pga-tour-api/lib/v2/pga-tour-api.constants';
import {
  PgaApiPlayerSeasonResultsResponse,
  PgaApiProjectedPlayerPoints,
  PgaApiTournamentLeaderboardRow,
} from '../../pga-tour-api/lib/v2/pga-tour-api.interface';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
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
    private readonly pgaPlayerService: PgaPlayerService,
    private readonly pgaTournamentService: PgaTournamentService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentPlayerService.name)
  ) {}

  async list(
    filter: PgaTournamentPlayerFilter,
    options: { page?: IListParams['page']; order?: FindOptionsOrder<PgaTournamentPlayer> } = {},
    repo: Repository<PgaTournamentPlayer> = this.tourneyPlayerRepo
  ): Promise<PgaTournamentPlayer[] | PaginatedCollection<PgaTournamentPlayer>> {
    const findOptions: FindOptionsWhere<PgaTournamentPlayer> = {
      ...(filter.tournamentId ? { pga_tournament: { id: filter.tournamentId } } : {}),
      ...(filter.playerId ? { pga_player: { id: filter.playerId } } : {}),
      ...(filter.year ? { pga_tournament: { year: filter.year } } : {}),
    };

    const order: FindOptionsOrder<PgaTournamentPlayer> =
      options.order ??
      ({
        pga_tournament: { year: 'DESC', start_date: 'DESC' },
        score_total: 'DESC',
      } as FindOptionsOrder<PgaTournamentPlayer>);

    if (!options.page) {
      return repo.find({
        where: findOptions,
        relations: ['pga_tournament', 'pga_player'],
        order,
      });
    }

    const { number, size } = options.page;
    const [data, total] = await repo.findAndCount({
      where: findOptions,
      relations: ['pga_tournament', 'pga_player'],
      order,
      take: size,
      skip: (number - 1) * size,
    });

    return {
      data,
      meta: {
        requested_size: size,
        actual_size: data.length,
        number,
        total,
      },
    };
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
    const pgaTournament = await this.pgaTournamentService.get(pgaTournamentId);
    if (!pgaTournament) {
      throw new Error(`PGA Tournament ${pgaTournamentId} does not exist`);
    }

    const pgaLeaderboard = await this.pgaTourApi.getTournamentLeaderboard(
      pgaTournament.year,
      pgaTournament.tournament_id
    );
    await this.updateScoresWithLeaderboard(pgaTournament, pgaLeaderboard, repo);
  }

  async upsertFieldForTournament(
    pgaTournamentId: string,
    repo: Repository<PgaTournamentPlayer> = this.tourneyPlayerRepo
  ) {
    const pgaTournament = await this.pgaTournamentService.get(pgaTournamentId);
    if (!pgaTournament) {
      throw new Error(`PGA Tournament ${pgaTournamentId} does not exist`);
    }

    let pgaLeaderboard: Awaited<ReturnType<PgaTourApiService['getTournamentLeaderboard']>>;
    try {
      pgaLeaderboard = await this.pgaTourApi.getTournamentLeaderboard(
        pgaTournament.year,
        pgaTournament.tournament_id
      );
    } catch (e) {
      this.logger.warn(
        `Skipping field upsert for PGA Tournament ${pgaTournament.id}: leaderboard not available (${e})`
      );
      return;
    }

    const leaderboardPlayers = pgaLeaderboard.leaderboard.players;
    if (!Array.isArray(leaderboardPlayers) || leaderboardPlayers.length === 0) {
      this.logger.warn(
        `Skipping field upsert for PGA Tournament ${pgaTournament.id}: empty leaderboard`
      );
      return;
    }

    const leaderboardPlayerIds = leaderboardPlayers.map((player) => Number(player.id));
    const existingPlayers = await this.pgaPlayerService.listByIds(leaderboardPlayerIds);
    const existingPlayerIdSet = new Set(existingPlayers.map((player) => player.id));
    const filteredLeaderboardPlayers = leaderboardPlayers.filter((player) =>
      existingPlayerIdSet.has(Number(player.id))
    );

    if (filteredLeaderboardPlayers.length === 0) {
      this.logger.warn(
        `Skipping field upsert for PGA Tournament ${pgaTournament.id}: no leaderboard players found in pga_player`
      );
      return;
    }

    if (pgaTournament.tournament_status === PgaTournamentStatus.NOT_STARTED) {
      const existing = await repo
        .createQueryBuilder('ptp')
        .select(['ptp.id', 'ptp.pga_player'])
        .addSelect('ptp_pool.id', 'pool_ref_id')
        .leftJoin('pool_tournament_player', 'ptp_pool', 'ptp_pool.pga_tournament_player = ptp.id')
        .where('ptp.pga_tournament = :tournamentId', { tournamentId: pgaTournament.id })
        .getRawMany<{ ptp_id: string; ptp_pga_player: number; pool_ref_id: string | null }>();

      const incomingIds = new Set(filteredLeaderboardPlayers.map((player) => Number(player.id)));
      const staleRows = existing.filter((row) => !incomingIds.has(Number(row.ptp_pga_player)));

      const idsToDelete = staleRows.filter((row) => !row.pool_ref_id).map((row) => row.ptp_id);
      const idsToWithdraw = staleRows.filter((row) => row.pool_ref_id).map((row) => row.ptp_id);

      if (idsToDelete.length > 0) {
        await repo.delete(idsToDelete);
      }
      if (idsToWithdraw.length > 0) {
        await repo.update(idsToWithdraw, {
          active: false,
          status: PlayerStatus.Withdrawn,
        });
      }
    }
    await this.updateScoresWithLeaderboard(
      pgaTournament,
      {
        ...pgaLeaderboard,
        leaderboard: { ...pgaLeaderboard.leaderboard, players: filteredLeaderboardPlayers },
      },
      repo
    );

    await this.tryCalculateOfficialFedexCupPoints(pgaTournament, filteredLeaderboardPlayers, repo);
  }

  private async updateScoresWithLeaderboard(
    pgaTournament: PgaTournament,
    pgaLeaderboard: Awaited<ReturnType<PgaTourApiService['getTournamentLeaderboard']>>,
    repo: Repository<PgaTournamentPlayer>
  ) {
    const updateBatchSize = 100;
    const leaderboardPlayers = pgaLeaderboard.leaderboard.players;
    const projectedFedexPoints = await this.tryGetProjectedFedexCupPoints(pgaTournament);

    for (let i = 0; i < leaderboardPlayers.length; i += updateBatchSize) {
      const batch = leaderboardPlayers.slice(i, i + updateBatchSize);
      const updates: Array<DeepPartial<PgaTournamentPlayer>> = batch.map((entry) => {
        const playerId = Number(entry.id);
        const projectedPoints = this.coerceFedexCupPoints(
          projectedFedexPoints[playerId]?.projectedEventPoints
        );

        return {
          id: `${playerId}-${pgaTournament.id}`,
          pga_player: { id: playerId },
          pga_tournament: { id: pgaTournament.id },
          active: entry.scoringData.playerState === 'ACTIVE',
          status: this.coercePlayerStatus(entry.scoringData.playerState),
          is_round_complete: entry.scoringData.thruSort >= 18,
          current_round: entry.scoringData.currentRound,
          current_hole: entry.scoringData.thruSort >= 18 ? null : entry.scoringData.thruSort + 1,
          starting_hole: 1,
          tee_time: entry.scoringData.teeTime === -1 ? null : entry.scoringData.teeTime,
          score_total: entry.scoringData.totalSort,
          score_thru: Math.min(18, entry.scoringData.thruSort),
          current_position:
            entry.scoringData.position === NullStringValue ? null : entry.scoringData.position,
          projected_fedex_cup_points: projectedPoints,
        };
      });

      await repo.upsert(updates, ['id']);
    }
  }

  private async tryGetProjectedFedexCupPoints(pgaTournament: PgaTournament) {
    let points: PgaApiProjectedPlayerPoints[];
    try {
      points = await this.pgaTourApi
        .getProjectedFedexCupPoints(pgaTournament.year, pgaTournament.tournament_id)
        .then((r) => r.points);
    } catch (e) {
      this.logger.error(
        `Error fetching projected FedEx Cup points from PGA Tour API: ${e}`,
        e.stack
      );
      return {};
    }

    const playerPointMap: Record<number, PgaApiProjectedPlayerPoints> = {};
    const projectedTournamentId = this.toProjectedPointTournamentId(pgaTournament.id);

    for (const playerPoints of points) {
      if (playerPoints.tournamentId === projectedTournamentId) {
        playerPointMap[Number(playerPoints.playerId)] = playerPoints;
      }
    }

    return playerPointMap;
  }

  private async tryCalculateOfficialFedexCupPoints(
    pgaTournament: PgaTournament,
    leaderboardPlayers: PgaApiTournamentLeaderboardRow[],
    repo: Repository<PgaTournamentPlayer>
  ) {
    if (
      pgaTournament.tournament_status !== PgaTournamentStatus.COMPLETED ||
      pgaTournament.official_fedex_cup_points_calculated
    ) {
      return;
    }

    await repo.manager.transaction(async (txManager) => {
      const tournamentRepo = txManager.getRepository(PgaTournament);
      const tournamentPlayerRepo = txManager.getRepository(PgaTournamentPlayer);
      const tournament = await tournamentRepo.findOneBy({ id: pgaTournament.id });
      if (!tournament) {
        throw new Error(`PGA Tournament ${pgaTournament.id} does not exist`);
      }
      if (tournament.official_fedex_cup_points_calculated) {
        return;
      }

      const updateBatchSize = 50;
      const fetchConcurrency = 10;
      const playerIds = leaderboardPlayers.map((player) => Number(player.id));
      for (let i = 0; i < playerIds.length; i += updateBatchSize) {
        const batch = playerIds.slice(i, i + updateBatchSize);
        const pointsByPlayer = await this.mapWithConcurrency(
          batch,
          fetchConcurrency,
          async (playerId) => {
            try {
              const results = await this.pgaTourApi.getPlayerSeasonResults(
                playerId,
                tournament.year
              );
              return this.extractOfficialFedexCupPoints(results, tournament.id, playerId);
            } catch (e) {
              this.logger.error(
                `Failed to calculate official FedEx Cup points for player ${playerId} tournament ${tournament.id}: ${e}`,
                e.stack
              );
              throw e;
            }
          }
        );

        this.logger.debug?.(
          `FedExCup official points fetched for ${batch.length} players (${i + 1}-${
            i + batch.length
          } of ${playerIds.length})`
        );

        const updates = batch.map((playerId, index) =>
          tournamentPlayerRepo.update(`${playerId}-${tournament.id}`, {
            official_fedex_cup_points: pointsByPlayer[index],
          })
        );
        await Promise.all(updates);
      }

      await tournamentRepo.update(tournament.id, {
        official_fedex_cup_points_calculated: true,
      });
    });
  }

  private extractOfficialFedexCupPoints(
    results: PgaApiPlayerSeasonResultsResponse,
    tournamentId: string,
    playerId: number
  ): number {
    const data = results?.resultsData?.[0]?.data ?? [];
    const tournamentData = data.find((row) => row.tournamentId === tournamentId);
    if (!tournamentData) {
      throw new Error(
        `No results for tournament ${tournamentId} found in season results for player ${playerId}`
      );
    }

    const pointsField = tournamentData.fields?.[10];
    if (pointsField === undefined) {
      throw new Error(
        `FedEx Cup points missing for tournament ${tournamentId} in season results for player ${playerId}`
      );
    }

    const normalizedPointsField =
      typeof pointsField === 'string' ? pointsField.trim() : String(pointsField);

    if (normalizedPointsField === '-' || normalizedPointsField === '') {
      return 0;
    }

    const points = Number(normalizedPointsField);
    if (Number.isNaN(points)) {
      throw new Error(
        `Invalid FedEx Cup points "${pointsField}" for tournament ${tournamentId} and player ${playerId}`
      );
    }

    return points;
  }

  private async mapWithConcurrency<T, R>(
    items: T[],
    concurrency: number,
    worker: (item: T, index: number) => Promise<R>
  ): Promise<R[]> {
    const results = new Array<R>(items.length);
    let nextIndex = 0;

    const runWorker = async () => {
      while (true) {
        const currentIndex = nextIndex;
        if (currentIndex >= items.length) {
          return;
        }
        nextIndex += 1;
        results[currentIndex] = await worker(items[currentIndex], currentIndex);
      }
    };

    const runners = Array.from({ length: Math.min(concurrency, items.length) }, runWorker);
    await Promise.all(runners);
    return results;
  }

  private coercePlayerStatus(
    val: PgaApiTournamentLeaderboardRow['scoringData']['playerState']
  ): PlayerStatus {
    const map: Record<string, PlayerStatus> = {
      ACTIVE: PlayerStatus.Active,
      COMPLETE: PlayerStatus.Complete,
      CUT: PlayerStatus.Cut,
      WITHDRAWN: PlayerStatus.Withdrawn,
      WD: PlayerStatus.Withdrawn,
      DQ: PlayerStatus.Withdrawn,
    };

    return map[val] ?? PlayerStatus.Active;
  }

  private coercePgaPlayerId(id: string) {
    if (id.length === 4) {
      return `0${id}`;
    }

    return id;
  }

  private toProjectedPointTournamentId(tournamentId: string): string {
    if (tournamentId.startsWith('R')) {
      return tournamentId;
    }

    const [tourneyId, year] = tournamentId.split('-');
    if (tourneyId && year) {
      return `R${year}${tourneyId}`;
    }

    return tournamentId;
  }

  private coerceFedexCupPoints(points: string): number {
    return !isNaN(Number(points)) ? Number(points) : 0;
  }
}
