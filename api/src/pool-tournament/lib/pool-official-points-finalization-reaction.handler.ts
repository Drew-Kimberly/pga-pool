import { OnDomainEvent } from '../../domain-events/domain-event.decorator';
import { DomainEventHandler } from '../../domain-events/domain-event.interface';
import type { PgaTournamentOfficialPointsCalculatedPayload } from '../../pga-tournament/lib/pga-tournament.events';

import { PoolFinalizationService } from './pool-finalization.service';

/**
 * Retriggers finalization once official FedEx points land. This is the healing
 * path for FedEx pools whose tournament reached COMPLETED before official
 * points were calculated: the status-updated handler skipped them (not ready),
 * and this event finalizes them with the correct values.
 */
@OnDomainEvent('pga-tournament.official-points-calculated')
export class PoolOfficialPointsFinalizationReactionHandler implements DomainEventHandler<PgaTournamentOfficialPointsCalculatedPayload> {
  constructor(private readonly poolFinalizationService: PoolFinalizationService) {}

  async handle(payload: PgaTournamentOfficialPointsCalculatedPayload): Promise<void> {
    await this.poolFinalizationService.finalizeReadyPoolTournaments(payload.pgaTournament.id);
  }
}
