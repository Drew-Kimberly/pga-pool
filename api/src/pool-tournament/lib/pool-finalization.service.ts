import { DataSource } from 'typeorm';

import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';
import { PoolTournamentUserService } from '../../pool-tournament-user/lib/pool-tournament-user.service';

import { PoolTournament } from './pool-tournament.entity';
import { PoolTournamentService } from './pool-tournament.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

/**
 * Finalizes pool tournaments once their scoring inputs are actually final.
 *
 * Finalization is readiness-gated and order-independent: whichever of
 * {tournament reaches COMPLETED, official FedEx points calculated} happens last
 * drives the correct finalize. A pool tournament that is not yet ready is
 * skipped WITHOUT locking, so a later `official-points-calculated` event can
 * finalize it. Each finalize recomputes its own pool_tournament_user inputs, so
 * it never bakes in a transient zero regardless of whether the scores-updated
 * recompute has run.
 */
@Injectable()
export class PoolFinalizationService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly poolTournamentService: PoolTournamentService,
    private readonly poolTournamentUserService: PoolTournamentUserService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PoolFinalizationService.name)
  ) {}

  async finalizeReadyPoolTournaments(pgaTournamentId: string): Promise<void> {
    const poolTournaments = await this.poolTournamentService.listByPgaTournamentId(pgaTournamentId);

    for (const poolTournament of poolTournaments) {
      if (poolTournament.scores_are_official) {
        this.logger.log(
          `Scores already official for pool tournament ${poolTournament.id}, skipping`
        );
        continue;
      }

      if (!this.isReadyToFinalize(poolTournament)) {
        this.logger.log(`Pool tournament ${poolTournament.id} not ready to finalize yet, skipping`);
        continue;
      }

      await this.finalizePoolTournament(poolTournament);
    }
  }

  /**
   * A pool tournament is ready to finalize once its PGA tournament is COMPLETED
   * and its scoring inputs are settled: strokes are settled at COMPLETED, while
   * FedEx pools must additionally wait for official points to be calculated
   * (the projected points collapse to zero for a finished event).
   */
  private isReadyToFinalize(poolTournament: PoolTournament): boolean {
    if (poolTournament.pga_tournament?.tournament_status !== PgaTournamentStatus.COMPLETED) {
      return false;
    }

    const scoringFormat = poolTournament.pool?.settings?.scoring_format;
    switch (scoringFormat) {
      case PoolScoringFormat.Strokes:
        return true;
      case PoolScoringFormat.FedexCuptPoints:
        return poolTournament.pga_tournament.official_fedex_cup_points_calculated === true;
      default:
        return false;
    }
  }

  private async finalizePoolTournament(poolTournament: PoolTournament): Promise<void> {
    const scoringFormat = poolTournament.pool?.settings?.scoring_format;
    const scoreColumn = this.getScoreColumn(scoringFormat);

    if (!scoreColumn) {
      this.logger.warn(
        `Unknown scoring format "${scoringFormat}" for pool tournament ${poolTournament.id}, skipping finalization`
      );
      return;
    }

    await this.dataSource.transaction(async (manager) => {
      // Serialize concurrent finalizes of the same pool tournament (e.g. the
      // status-updated and official-points-calculated handlers overlapping).
      // Shares the advisory-lock keyspace with the CLI finalizer.
      await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [poolTournament.id]);

      // Re-check under the lock so a concurrent finalize can't double-count.
      const pt = await manager.getRepository(PoolTournament).findOneBy({ id: poolTournament.id });
      if (!pt || pt.scores_are_official) {
        return;
      }

      // Recompute this pool tournament's user scores from the now-final inputs
      // (no event emitted) so finalization never trusts a stale recompute.
      await this.poolTournamentUserService.recomputeScores(poolTournament.id, manager);

      // Add each user's tournament score into their running season pool_score.
      await manager.query(
        `
        UPDATE pool_user pu
        SET pool_score = pu.pool_score + COALESCE(ptu.${scoreColumn}, 0)
        FROM pool_tournament_user ptu
        WHERE ptu.pool_user_id = pu.id
          AND ptu.pool_tournament_id = $1
        `,
        [poolTournament.id]
      );

      await manager.getRepository(PoolTournament).update(poolTournament.id, {
        scores_are_official: true,
      });

      this.logger.log(`Finalized pool tournament ${poolTournament.id}`);
    });
  }

  private getScoreColumn(scoringFormat: PoolScoringFormat | undefined): string | null {
    switch (scoringFormat) {
      case PoolScoringFormat.FedexCuptPoints:
        return 'fedex_cup_points';
      case PoolScoringFormat.Strokes:
        return 'tournament_score';
      default:
        return null;
    }
  }
}
