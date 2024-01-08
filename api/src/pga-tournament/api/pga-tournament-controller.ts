import { ControllerBase } from '../../common/api';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournament } from '../lib/pga-tournament.entity';

import { Controller, Get } from '@nestjs/common';

@Controller('pga-tournaments')
export class PgaTournamentController extends ControllerBase {
  constructor(private readonly pgaTournamentService: PgaTournamentService) {
    super();
  }

  @Get()
  async list(): Promise<{ data: PgaTournamentDto[] }> {
    let tournaments: PgaTournament[];
    try {
      tournaments = await this.pgaTournamentService.list();
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error listing pga tournaments: ${e}`);
      throw e;
    }

    return { data: tournaments.map(PgaTournamentDto.fromEntity) };
  }
}
