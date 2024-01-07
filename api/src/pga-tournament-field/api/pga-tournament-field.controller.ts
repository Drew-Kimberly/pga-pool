import { ControllerBase } from '../../common/api';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentField } from '../lib/pga-tournament-field.interface';
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

    let tournament: PgaTournament | null;
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

    let field: PgaTournamentField | undefined;
    try {
      field = await this.pgaTourneyFieldService.get(tournament.id);
    } catch (e) {
      this.logErrorSkipping4xx(
        e,
        `Error fetching PGA Tournament field (ID: ${tournament.id}): ${e}`
      );
      throw e;
    }

    if (!field) {
      throw new NotFoundException(`PGA Tournament field (ID: ${tournament.id}) not found`);
    }

    return this.toPgaTournamentFieldDto(tournament, field);
  }

  private toPgaTournamentFieldDto(
    tournament: PgaTournament,
    field: PgaTournamentField
  ): PgaTournamentFieldDto {
    const dto = new PgaTournamentFieldDto(
      this.toPgaTournamentDto(tournament),
      new Date(field.created_at * 1000).toISOString()
    );

    Object.entries(field.player_tiers).forEach(([tier, player]) => {
      if (!Array.isArray(dto.player_tiers[Number(tier)])) {
        dto.player_tiers[Number(tier)] = [];
      }

      Object.entries(player).forEach(([playerId, playerData]) => {
        dto.player_tiers[Number(tier)].push({
          name: playerData.name,
          player_id: Number(playerId),
          odds: playerData.odds,
        });
      });
    });

    return dto;
  }

  private toPgaTournamentDto(tourney: PgaTournament): PgaTournamentDto {
    return {
      id: tourney.id,
      name: tourney.name,
      date: {
        start: tourney.start_date.toISOString(),
        end: tourney.end_date.toISOString(),
        year: tourney.year,
        timezone: tourney.timezone,
      },
    };
  }
}
