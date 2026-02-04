import { ControllerBase } from '../../common/api';
import { UUIDValidationPipe } from '../../common/api/validation';
import { PgaTournamentField } from '../../pga-tournament-field/lib/pga-tournament-field.interface';
import { PgaTournamentFieldService } from '../../pga-tournament-field/lib/pga-tournament-field.service';
import { PoolTournamentDto } from '../../pool-tournament/api/pool-tournament.dto';
import { PoolTournamentService } from '../../pool-tournament/lib/pool-tournament.service';
import { PoolTournamentPlayerDto } from '../../pool-tournament-player/api/pool-tournament-player.dto';
import { PoolTournamentPlayerService } from '../../pool-tournament-player/lib/pool-tournament-player.service';

import { PoolTournamentFieldDto } from './pool-tournament-field.dto';

import {
  Controller,
  Get,
  Logger,
  LoggerService,
  NotFoundException,
  Optional,
} from '@nestjs/common';

@Controller('pools/:poolId/tournaments/:poolTournamentId/field')
export class PoolTournamentFieldController extends ControllerBase {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly poolTournamentPlayerService: PoolTournamentPlayerService,
    private readonly pgaTournamentFieldService: PgaTournamentFieldService,
    @Optional()
    protected readonly logger: LoggerService = new Logger(PoolTournamentFieldController.name)
  ) {
    super(logger);
  }

  @Get()
  async getField(
    @UUIDValidationPipe('poolId') poolId: string,
    @UUIDValidationPipe('poolTournamentId') poolTournamentId: string
  ): Promise<PoolTournamentFieldDto> {
    this.logger.log(`Getting field for Pool Tournament ${poolTournamentId}`);

    const poolTournament = await this.poolTournamentService.get(poolTournamentId, poolId);
    if (!poolTournament) {
      throw new NotFoundException(`Pool Tournament (ID: ${poolTournamentId}) not found`);
    }

    let field: PgaTournamentField | undefined;
    try {
      field = await this.pgaTournamentFieldService.get(poolTournament.pga_tournament_id);
    } catch (e) {
      this.logErrorSkipping4xx(
        e,
        `Error fetching PGA Tournament field (ID: ${poolTournament.pga_tournament_id}): ${e}`
      );
      throw e;
    }

    if (!field) {
      throw new NotFoundException(
        `PGA Tournament field (ID: ${poolTournament.pga_tournament_id}) not found`
      );
    }

    const players = await this.poolTournamentPlayerService.list({
      poolTournamentId: poolTournament.id,
    });

    const dto = new PoolTournamentFieldDto(
      PoolTournamentDto.fromEntity(poolTournament),
      new Date(field.created_at * 1000).toISOString()
    );

    players.forEach((player) => {
      if (!Array.isArray(dto.player_tiers[player.tier])) {
        dto.player_tiers[player.tier] = [];
      }
      dto.player_tiers[player.tier].push(PoolTournamentPlayerDto.fromEntity(player));
    });

    return dto;
  }
}
