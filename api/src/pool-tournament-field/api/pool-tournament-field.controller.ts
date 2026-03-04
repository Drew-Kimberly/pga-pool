import { ControllerBase } from '../../common/api';
import { UUIDValidationPipe } from '../../common/api/validation';
import { RoundSummaryDto } from '../../pga-tournament-player-hole/api/pga-tournament-player-hole.dto';
import { PgaTournamentPlayerHoleService } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.service';
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
    private readonly holeService: PgaTournamentPlayerHoleService,
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

    const players = await this.poolTournamentPlayerService.list({
      poolTournamentId: poolTournament.id,
    });

    const playerIds = players.map((p) => p.pga_tournament_player.id);
    const rawRoundsMap = await this.holeService.getRoundSummariesBatch(playerIds);
    const roundsMap = new Map<string, RoundSummaryDto[]>();
    for (const [id, rounds] of rawRoundsMap) {
      roundsMap.set(id, rounds.map(RoundSummaryDto.from));
    }

    const createdAt = poolTournament.field_published_at
      ? poolTournament.field_published_at.toISOString()
      : null;

    const dto = new PoolTournamentFieldDto(PoolTournamentDto.fromEntity(poolTournament), createdAt);

    players.forEach((player) => {
      if (!Array.isArray(dto.player_tiers[player.tier])) {
        dto.player_tiers[player.tier] = [];
      }
      dto.player_tiers[player.tier].push(PoolTournamentPlayerDto.fromEntity(player, roundsMap));
    });

    return dto;
  }
}
