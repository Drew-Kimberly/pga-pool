import { ControllerBase } from '../../common/api';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentFieldService } from '../lib/pga-tournament-field.service';

import { PgaTournamentFieldDto } from './pga-tournament-field.dto';

import {
  Controller,
  Get,
  Logger,
  LoggerService,
  NotFoundException,
  Optional,
  Param,
} from '@nestjs/common';

@Controller('pga-tournaments/:pgaTournamentId/field')
export class PgaTournamentFieldController extends ControllerBase {
  constructor(
    private readonly pgaTourneyFieldService: PgaTournamentFieldService,
    private readonly pgaTourneyService: PgaTournamentService,
    @Optional()
    protected readonly logger: LoggerService = new Logger(PgaTournamentFieldController.name)
  ) {
    super(logger);
  }

  @Get()
  async getField(
    @Param('pgaTournamentId') pgaTournamentId: string
  ): Promise<PgaTournamentFieldDto> {
    this.logger.log(`Getting field for PGA Tournament ${pgaTournamentId}`);

    let tournament;
    try {
      tournament = await this.pgaTourneyService.get(pgaTournamentId);
    } catch (e) {
      this.logErrorSkipping4xx(
        e,
        `Error fetching PGA Tournament field (ID: ${pgaTournamentId}): ${e}`
      );
      throw e;
    }

    if (!tournament) {
      throw new NotFoundException(`PGA Tournament (ID: ${pgaTournamentId}) not found`);
    }

    const players = await this.pgaTourneyFieldService.getPlayers(tournament.id);

    return new PgaTournamentFieldDto(PgaTournamentDto.fromEntity(tournament), players);
  }
}
