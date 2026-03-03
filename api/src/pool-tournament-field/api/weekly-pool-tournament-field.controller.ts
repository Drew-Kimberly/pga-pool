import { ControllerBase } from '../../common/api';
import { UUIDValidationPipe } from '../../common/api/validation';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
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

@Controller('pools/:poolId/weekly-field')
export class WeeklyPoolTournamentFieldController extends ControllerBase {
  constructor(
    private readonly pgaTournamentService: PgaTournamentService,
    private readonly poolTournamentService: PoolTournamentService,
    private readonly poolTournamentPlayerService: PoolTournamentPlayerService,
    @Optional()
    protected readonly logger: LoggerService = new Logger(WeeklyPoolTournamentFieldController.name)
  ) {
    super(logger);
  }

  @Get()
  async getWeeklyField(
    @UUIDValidationPipe('poolId') poolId: string
  ): Promise<PoolTournamentFieldDto> {
    this.logger.log(`Getting weekly field for Pool ${poolId}`);

    const pgaTournament = await this.pgaTournamentService.getWeeklyTournament();
    if (!pgaTournament) {
      throw new NotFoundException('No PGA Tournament scheduled for this week');
    }

    const poolTournament = await this.poolTournamentService.getByPoolAndPgaTournament(
      poolId,
      pgaTournament.id
    );
    if (!poolTournament) {
      throw new NotFoundException('No pool tournament found for this pool and week');
    }

    const players = await this.poolTournamentPlayerService.list({
      poolTournamentId: poolTournament.id,
    });

    const createdAt = poolTournament.field_published_at
      ? poolTournament.field_published_at.toISOString()
      : null;

    const dto = new PoolTournamentFieldDto(PoolTournamentDto.fromEntity(poolTournament), createdAt);

    players.forEach((player) => {
      if (!Array.isArray(dto.player_tiers[player.tier])) {
        dto.player_tiers[player.tier] = [];
      }
      dto.player_tiers[player.tier].push(PoolTournamentPlayerDto.fromEntity(player));
    });

    return dto;
  }
}
