import { SeedDataService } from '../../seed-data/lib/seed-data.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PoolTournamentService {
  constructor(private readonly seedDataService: SeedDataService) {}

  async list() {
    return [];
  }
}
