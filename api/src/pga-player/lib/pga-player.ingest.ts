import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';

import { PgaPlayerService } from './pga-player.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

@Injectable()
export class PgaPlayerIngestor {
  constructor(
    private readonly pgaPlayerService: PgaPlayerService,
    private readonly pgaTourApi: PgaTourApiService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaPlayerIngestor.name)
  ) {}

  async ingest(includeInactive = false) {
    const tourPlayers = await this.pgaTourApi.getPlayers(!includeInactive);

    this.logger.log(`Ingesting ${tourPlayers.length} players`);

    return this.pgaPlayerService.save(
      tourPlayers.map((p) => ({
        id: p.id,
        active: p.isActive,
        name: p.displayName,
        short_name: p.shortName,
        first_name: p.firstName,
        last_name: p.lastName,
        headshot_url: p.headshot ?? null,
        country: p.country ?? null,
        country_flag: p.countryFlag ?? null,
      }))
    );
  }
}
