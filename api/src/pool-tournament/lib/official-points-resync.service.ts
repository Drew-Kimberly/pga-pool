import { DataSource, EntityManager } from 'typeorm';

import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';
import {
  MIN_MATCHED_SEASON_RESULTS_RATIO,
  PgaTournamentPlayerService,
} from '../../pga-tournament-player/lib/pga-tournament-player.service';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';
import { PoolTournamentUserService } from '../../pool-tournament-user/lib/pool-tournament-user.service';

import { PoolFinalizationService } from './pool-finalization.service';
import { PoolTournament } from './pool-tournament.entity';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

export interface PlayerPointsCorrection {
  pgaPlayerId: number;
  playerName: string;
  previousPoints: number | null;
  updatedPoints: number;
}

export interface PoolUserScoreAdjustment {
  poolUserId: string;
  previousFedexCupPoints: number;
  updatedFedexCupPoints: number;
  /** Amount added to the user's season pool_score (0 when nothing was re-credited). */
  poolScoreDelta: number;
}

export interface PoolTournamentAdjustment {
  poolTournamentId: string;
  scoresWereOfficial: boolean;
  userAdjustments: PoolUserScoreAdjustment[];
}

export interface OfficialPointsResyncResult {
  pgaTournamentId: string;
  dryRun: boolean;
  playersChecked: number;
  matchedPlayers: number;
  playerCorrections: PlayerPointsCorrection[];
  poolTournamentAdjustments: PoolTournamentAdjustment[];
}

/**
 * Re-syncs a completed tournament's official FedEx Cup points from the
 * season-results feed and heals everything derived from them, including pools
 * that were already finalized.
 *
 * This is the repair path for the failure mode where the official-points calc
 * ran against a partially-propagated feed and locked wrong zeros in as
 * official: finalization is write-once, so without this there is no way to
 * correct a finalized pool. Already-credited season pool_scores are adjusted by
 * the per-user delta (never re-added wholesale), so the resync is idempotent —
 * once the feed matches the database, a re-run changes nothing.
 */
@Injectable()
export class OfficialPointsResyncService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly pgaTournamentPlayerService: PgaTournamentPlayerService,
    private readonly poolTournamentUserService: PoolTournamentUserService,
    private readonly poolFinalizationService: PoolFinalizationService,
    @Optional()
    private readonly logger: LoggerService = new Logger(OfficialPointsResyncService.name)
  ) {}

  async resync(
    pgaTournamentId: string,
    { dryRun = false }: { dryRun?: boolean } = {}
  ): Promise<OfficialPointsResyncResult> {
    const tournament = await this.dataSource
      .getRepository(PgaTournament)
      .findOneBy({ id: pgaTournamentId });
    if (!tournament) {
      throw new Error(`PGA Tournament ${pgaTournamentId} does not exist`);
    }
    if (tournament.tournament_status !== PgaTournamentStatus.COMPLETED) {
      throw new Error(
        `PGA Tournament ${pgaTournamentId} is ${tournament.tournament_status}, not COMPLETED`
      );
    }

    const tournamentPlayers = await this.dataSource.getRepository(PgaTournamentPlayer).find({
      where: { pga_tournament: { id: pgaTournamentId } },
    });
    // Field-only rows that never made a leaderboard (no position, no score)
    // have no season-results row upstream and would skew the settle check.
    const participants = tournamentPlayers.filter(
      (p) => p.current_position !== null || p.score_total !== null
    );
    if (participants.length === 0) {
      throw new Error(`No participants found for PGA Tournament ${pgaTournamentId}`);
    }

    const playerIds = participants.map((p) => p.pga_player.id);
    const { pointsByPlayerId, matchedPlayerIds } =
      await this.pgaTournamentPlayerService.fetchOfficialFedexCupPoints(tournament, playerIds);

    if (matchedPlayerIds.size / playerIds.length < MIN_MATCHED_SEASON_RESULTS_RATIO) {
      throw new Error(
        `Only ${matchedPlayerIds.size} of ${playerIds.length} players have a season-results row ` +
          `for tournament ${pgaTournamentId}; feed looks unsettled, refusing to resync`
      );
    }

    const playerCorrections = participants
      .map((p) => ({
        pgaPlayerId: p.pga_player.id,
        playerName: p.pga_player.name,
        previousPoints: p.official_fedex_cup_points,
        updatedPoints: pointsByPlayerId.get(p.pga_player.id) ?? 0,
      }))
      .filter((c) => c.previousPoints !== c.updatedPoints);

    const result: OfficialPointsResyncResult = {
      pgaTournamentId,
      dryRun,
      playersChecked: participants.length,
      matchedPlayers: matchedPlayerIds.size,
      playerCorrections,
      poolTournamentAdjustments: [],
    };

    if (dryRun) {
      return result;
    }

    await this.dataSource.transaction(async (manager) => {
      const poolTournaments = await manager
        .getRepository(PoolTournament)
        .find({ where: { pga_tournament_id: pgaTournamentId } });

      // Serialize against concurrent finalizes of the same pool tournaments
      // (shares the advisory-lock keyspace with the finalization services).
      for (const poolTournament of poolTournaments) {
        await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [poolTournament.id]);
      }

      const tournamentPlayerRepo = manager.getRepository(PgaTournamentPlayer);
      for (const correction of playerCorrections) {
        await tournamentPlayerRepo.update(`${correction.pgaPlayerId}-${pgaTournamentId}`, {
          official_fedex_cup_points: correction.updatedPoints,
        });
      }

      if (!tournament.official_fedex_cup_points_calculated) {
        await manager.getRepository(PgaTournament).update(pgaTournamentId, {
          official_fedex_cup_points_calculated: true,
        });
      }

      for (const poolTournament of poolTournaments) {
        const before = await this.getUserPointsSnapshot(manager, poolTournament.id);
        await this.poolTournamentUserService.recomputeScores(poolTournament.id, manager);
        const after = await this.getUserPointsSnapshot(manager, poolTournament.id);

        // Only a finalized FedEx pool has already credited these points into
        // season pool_scores; anything else needs no re-crediting (a pending
        // pool gets credited by its own finalize, a strokes pool never uses
        // fedex_cup_points).
        const shouldAdjustPoolScore =
          poolTournament.scores_are_official &&
          poolTournament.pool?.settings?.scoring_format === PoolScoringFormat.FedexCuptPoints;

        const userAdjustments: PoolUserScoreAdjustment[] = [];
        for (const [poolTournamentUserId, beforeRow] of before) {
          const afterRow = after.get(poolTournamentUserId);
          if (!afterRow || afterRow.points === beforeRow.points) {
            continue;
          }

          const delta = afterRow.points - beforeRow.points;
          if (shouldAdjustPoolScore) {
            await manager.query('UPDATE pool_user SET pool_score = pool_score + $1 WHERE id = $2', [
              delta,
              beforeRow.poolUserId,
            ]);
          }

          userAdjustments.push({
            poolUserId: beforeRow.poolUserId,
            previousFedexCupPoints: beforeRow.points,
            updatedFedexCupPoints: afterRow.points,
            poolScoreDelta: shouldAdjustPoolScore ? delta : 0,
          });
        }

        result.poolTournamentAdjustments.push({
          poolTournamentId: poolTournament.id,
          scoresWereOfficial: poolTournament.scores_are_official,
          userAdjustments,
        });
      }
    });

    // Pools that were never finalized (e.g. their tournament completed before
    // the official-points feature existed) are now ready — finalize them so the
    // resync leaves nothing pending. Already-official pools are skipped.
    await this.poolFinalizationService.finalizeReadyPoolTournaments(pgaTournamentId);

    this.logger.log(
      `Resynced official FedEx Cup points for ${pgaTournamentId}: ` +
        `${playerCorrections.length} of ${participants.length} players corrected`
    );

    return result;
  }

  private async getUserPointsSnapshot(
    manager: EntityManager,
    poolTournamentId: string
  ): Promise<Map<string, { poolUserId: string; points: number }>> {
    const rows: Array<{ id: string; pool_user_id: string; fedex_cup_points: string | null }> =
      await manager.query(
        'SELECT id, pool_user_id, fedex_cup_points FROM pool_tournament_user WHERE pool_tournament_id = $1',
        [poolTournamentId]
      );

    return new Map(
      rows.map((row) => [
        row.id,
        { poolUserId: row.pool_user_id, points: Number(row.fedex_cup_points ?? 0) },
      ])
    );
  }
}
