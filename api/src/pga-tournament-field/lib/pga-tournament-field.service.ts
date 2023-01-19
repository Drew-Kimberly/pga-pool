import { SeedDataService } from '../../seed-data/lib/seed-data.service';

import { PgaTournamentField } from './pga-tournament-field.interface';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PgaTournamentFieldService {
  constructor(private readonly seedDataService: SeedDataService) {}

  async get(pgaTournamentId: string) {
    return this.seedDataService.getSeedData<{ field: PgaTournamentField }>(pgaTournamentId)?.field;
  }
}
