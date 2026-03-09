import { DataSource } from 'typeorm';

import { OnDomainEvent } from '../../domain-events/domain-event.decorator';
import { DomainEventHandler } from '../../domain-events/domain-event.interface';
import type { PgaTournamentStatusUpdatedPayload } from '../../pga-tournament/lib/pga-tournament.events';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';

import { PoolTournament } from './pool-tournament.entity';
import { PoolTournamentService } from './pool-tournament.service';

import { Logger, LoggerService, Optional } from '@nestjs/common';

@OnDomainEvent('pga-tournament.status-updated')
export class PoolFinalizationReactionHandler implements DomainEventHandler<PgaTournamentStatusUpdatedPayload> {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly dataSource: DataSource,
    @Optional()
    private readonly logger: LoggerService = new Logger(PoolFinalizationReactionHandler.name)
  ) {}

  async handle(payload: PgaTournamentStatusUpdatedPayload): Promise<void> {
    if (payload.newStatus !== PgaTournamentStatus.COMPLETED) {
      return;
    }

    const poolTournaments = await this.poolTournamentService.listByPgaTournamentId(
      payload.pgaTournament.id
    );

    for (const poolTournament of poolTournaments) {
      if (poolTournament.scores_are_official) {
        this.logger.log(
          `Scores already official for pool tournament ${poolTournament.id}, skipping`
        );
        continue;
      }

      await this.finalizePoolTournament(poolTournament);
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
      // Re-check within transaction
      const pt = await manager.getRepository(PoolTournament).findOneBy({ id: poolTournament.id });
      if (!pt || pt.scores_are_official) return;

      // Update pool_user.pool_score += tournament score delta for each user
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

      // Mark as official
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
