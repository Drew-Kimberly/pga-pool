import { DataSource } from 'typeorm';

import { OnDomainEvent } from '../../domain-events/domain-event.decorator';
import { DomainEventHandler } from '../../domain-events/domain-event.interface';
import { PgaTournamentScoresUpdatedPayload } from '../../pga-tournament/lib/pga-tournament.events';

import { PoolTournamentService } from './pool-tournament.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

@OnDomainEvent('pga-tournament.scores-updated')
@Injectable()
export class PoolScoreReactionHandler implements DomainEventHandler<PgaTournamentScoresUpdatedPayload> {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly dataSource: DataSource,
    @Optional()
    private readonly logger: LoggerService = new Logger(PoolScoreReactionHandler.name)
  ) {}

  async handle(payload: PgaTournamentScoresUpdatedPayload): Promise<void> {
    const poolTournaments = await this.poolTournamentService.listByPgaTournamentId(
      payload.pgaTournamentId
    );

    if (poolTournaments.length === 0) return;

    for (const poolTournament of poolTournaments) {
      await this.updatePoolTournamentScores(poolTournament.id);
    }
  }

  /**
   * Single UPDATE query that recalculates tournament_score and fedex_cup_points
   * for all pool_tournament_user records in a pool tournament by joining through
   * picks → pool_tournament_player → pga_tournament_player.
   */
  private async updatePoolTournamentScores(poolTournamentId: string): Promise<void> {
    // Note: pool_tournament_user_pick has a typo in the FK column: "pool_tournamnet_user_id"
    // Also note: pool_tournament_player FK to pga_tournament_player is column "pga_tournament_player" (not _id suffix)
    const result = await this.dataSource.query(
      `
      UPDATE pool_tournament_user ptu
      SET
        tournament_score = sub.total_score,
        fedex_cup_points = sub.total_fedex
      FROM (
        SELECT
          ptup.pool_tournamnet_user_id AS user_id,
          SUM(ptp.score_total)::int AS total_score,
          COALESCE(SUM(
            CASE
              WHEN pgat.official_fedex_cup_points_calculated
                THEN ptp.official_fedex_cup_points
              ELSE ptp.projected_fedex_cup_points
            END
          ), 0) AS total_fedex
        FROM pool_tournament_user_pick ptup
        JOIN pool_tournament_player ptpl ON ptup.pool_tournament_player_id = ptpl.id
        JOIN pga_tournament_player ptp ON ptpl.pga_tournament_player = ptp.id
        JOIN pga_tournament pgat ON ptp.pga_tournament = pgat.id
        WHERE ptup.pool_tournamnet_user_id IN (
          SELECT id FROM pool_tournament_user WHERE pool_tournament_id = $1
        )
        GROUP BY ptup.pool_tournamnet_user_id
      ) sub
      WHERE ptu.id = sub.user_id
      `,
      [poolTournamentId]
    );

    this.logger.log(
      `Updated scores for ${result[1]} pool user(s) in pool tournament ${poolTournamentId}`
    );
  }
}
