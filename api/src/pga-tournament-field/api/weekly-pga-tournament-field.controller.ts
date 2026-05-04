import { ControllerBase } from '../../common/api';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentFieldService } from '../lib/pga-tournament-field.service';

import { WeeklyPgaTournamentFieldDto } from './weekly-pga-tournament-field.dto';

import {
  Controller,
  Get,
  Logger,
  LoggerService,
  NotFoundException,
  Optional,
} from '@nestjs/common';

@Controller('pga-tournaments/weekly-field')
export class WeeklyPgaTournamentFieldController extends ControllerBase {
  constructor(
    private readonly pgaTourneyFieldService: PgaTournamentFieldService,
    private readonly pgaTourneyService: PgaTournamentService,
    @Optional()
    protected readonly logger: LoggerService = new Logger(WeeklyPgaTournamentFieldController.name)
  ) {
    super(logger);
  }

  @Get()
  async getWeeklyField(): Promise<WeeklyPgaTournamentFieldDto> {
    this.logger.log('Getting weekly tournament field');

    let tournaments;
    try {
      tournaments = await this.pgaTourneyService.getWeeklyTournaments();
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error fetching weekly tournaments: ${e}`);
      throw e;
    }

    const tournament = tournaments[0];
    if (!tournament) {
      throw new NotFoundException('No PGA Tournament scheduled for this week');
    }

    const players = await this.pgaTourneyFieldService.getPlayers(tournament.id);

    if (players.length === 0) {
      return new WeeklyPgaTournamentFieldDto(PgaTournamentDto.fromEntity(tournament), null);
    }

    return new WeeklyPgaTournamentFieldDto(PgaTournamentDto.fromEntity(tournament), players);
  }
}
