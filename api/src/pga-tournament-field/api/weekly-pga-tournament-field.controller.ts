import { ControllerBase } from '../../common/api';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentField } from '../lib/pga-tournament-field.interface';
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

    let tournament: PgaTournament | null;
    try {
      tournament = await this.pgaTourneyService.getWeeklyTournament();
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error fetching weekly tournament: ${e}`);
      throw e;
    }

    if (!tournament) {
      throw new NotFoundException('No PGA Tournament scheduled for this week');
    }

    let field: PgaTournamentField | undefined;
    try {
      field = await this.pgaTourneyFieldService.get(tournament.id);
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error fetching field for tournament ${tournament.id}: ${e}`);
      throw e;
    }

    if (!field) {
      return new WeeklyPgaTournamentFieldDto(PgaTournamentDto.fromEntity(tournament), null, null);
    }

    return this.toWeeklyPgaTournamentFieldDto(tournament, field);
  }

  private toWeeklyPgaTournamentFieldDto(
    tournament: PgaTournament,
    field: PgaTournamentField
  ): WeeklyPgaTournamentFieldDto {
    const dto = new WeeklyPgaTournamentFieldDto(
      PgaTournamentDto.fromEntity(tournament),
      new Date(field.created_at * 1000).toISOString()
    );

    dto.player_tiers = {};

    Object.entries(field.player_tiers).forEach(([tier, players]) => {
      const tierNum = Number(tier);
      dto.player_tiers![tierNum] = [];

      Object.entries(players).forEach(([playerId, playerData]) => {
        dto.player_tiers![tierNum].push({
          name: playerData.name,
          player_id: Number(playerId),
          odds: playerData.odds,
        });
      });

      // Sort players alphabetically by name within each tier
      dto.player_tiers![tierNum].sort((a, b) => a.name.localeCompare(b.name));
    });

    return dto;
  }
}
