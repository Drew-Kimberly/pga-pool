import { ControllerBase } from '../../common/api';
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

    let field: PgaTournamentField | undefined;
    try {
      field = await this.pgaTourneyFieldService.get(pgaTournamentId);
    } catch (e) {
      this.logErrorSkipping4xx(
        e,
        `Error fetching PGA Tournament field (ID: ${pgaTournamentId}): ${e}`
      );
      throw e;
    }

    if (!field) {
      throw new NotFoundException(`PGA Tournament field (ID: ${pgaTournamentId}) not found`);
    }

    return this.toPgaTournamentFieldDto(field);
  }

  private toPgaTournamentFieldDto(field: PgaTournamentField): PgaTournamentFieldDto {
    const dto = new PgaTournamentFieldDto(
      field.pga_tournament_id,
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
}
