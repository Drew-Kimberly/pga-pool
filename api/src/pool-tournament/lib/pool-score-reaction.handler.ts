import { OnDomainEvent } from '../../domain-events/domain-event.decorator';
import { DomainEventHandler } from '../../domain-events/domain-event.interface';
import type { PgaTournamentScoresUpdatedPayload } from '../../pga-tournament/lib/pga-tournament.events';
import { PoolTournamentUserService } from '../../pool-tournament-user/lib/pool-tournament-user.service';

import { PoolTournamentService } from './pool-tournament.service';

import { Logger, LoggerService, Optional } from '@nestjs/common';

@OnDomainEvent('pga-tournament.scores-updated')
export class PoolScoreReactionHandler implements DomainEventHandler<PgaTournamentScoresUpdatedPayload> {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly poolTournamentUserService: PoolTournamentUserService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PoolScoreReactionHandler.name)
  ) {}

  async handle(payload: PgaTournamentScoresUpdatedPayload): Promise<void> {
    const poolTournaments = await this.poolTournamentService.listByPgaTournamentId(
      payload.pgaTournament.id
    );

    if (poolTournaments.length === 0) return;

    for (const poolTournament of poolTournaments) {
      const affected = await this.poolTournamentUserService.recomputeScores(poolTournament.id);
      this.logger.log(
        `Updated scores for ${affected} pool user(s) in pool tournament ${poolTournament.id}`
      );
    }
  }
}
