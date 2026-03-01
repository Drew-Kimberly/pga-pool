import { ControllerBase } from '../../common/api';
import { PgaTournamentPlayerHoleService } from '../lib/pga-tournament-player-hole.service';

import { RoundSummaryDto, ScorecardDto } from './pga-tournament-player-hole.dto';

import {
  Controller,
  Get,
  Logger,
  LoggerService,
  NotFoundException,
  Optional,
  Param,
  Query,
} from '@nestjs/common';

@Controller('pga-tournament-players/:pgaTournamentPlayerId')
export class PgaTournamentPlayerHoleController extends ControllerBase {
  constructor(
    private readonly holeService: PgaTournamentPlayerHoleService,
    @Optional()
    protected readonly logger: LoggerService = new Logger(PgaTournamentPlayerHoleController.name)
  ) {
    super(logger);
  }

  @Get('rounds')
  async getRoundSummaries(
    @Param('pgaTournamentPlayerId') pgaTournamentPlayerId: string
  ): Promise<RoundSummaryDto[]> {
    this.logger.log(`Getting round summaries for player ${pgaTournamentPlayerId}`);

    const summaries = await this.holeService.getRoundSummaries(pgaTournamentPlayerId);
    return summaries.map(RoundSummaryDto.from);
  }

  @Get('scorecard')
  async getScorecard(
    @Param('pgaTournamentPlayerId') pgaTournamentPlayerId: string,
    @Query('round') roundParam: string
  ): Promise<ScorecardDto> {
    const round = Number(roundParam);
    if (!round || round < 1 || round > 4) {
      throw new NotFoundException('Round must be between 1 and 4');
    }

    this.logger.log(`Getting scorecard for player ${pgaTournamentPlayerId}, round ${round}`);

    const holes = await this.holeService.getScorecard(pgaTournamentPlayerId, round);
    if (holes.length === 0) {
      throw new NotFoundException(
        `No scorecard data found for player ${pgaTournamentPlayerId}, round ${round}`
      );
    }

    return ScorecardDto.from(round, holes);
  }
}
