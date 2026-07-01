import { OnDomainEvent } from '../../domain-events/domain-event.decorator';
import { DomainEventHandler } from '../../domain-events/domain-event.interface';
import type { PgaTournamentStatusUpdatedPayload } from '../../pga-tournament/lib/pga-tournament.events';
import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';

import { PoolFinalizationService } from './pool-finalization.service';

@OnDomainEvent('pga-tournament.status-updated')
export class PoolFinalizationReactionHandler implements DomainEventHandler<PgaTournamentStatusUpdatedPayload> {
  constructor(private readonly poolFinalizationService: PoolFinalizationService) {}

  async handle(payload: PgaTournamentStatusUpdatedPayload): Promise<void> {
    if (payload.newStatus !== PgaTournamentStatus.COMPLETED) {
      return;
    }

    await this.poolFinalizationService.finalizeReadyPoolTournaments(payload.pgaTournament.id);
  }
}
