import { PoolTournamentDto } from './pool-tournament.dto';

import { Controller, Get } from '@nestjs/common';

@Controller('pool/tournaments')
export class PoolTournamentController {
  @Get()
  async listTournaments(): Promise<{ data: PoolTournamentDto[] }> {
    return { data: [] };
  }
}
