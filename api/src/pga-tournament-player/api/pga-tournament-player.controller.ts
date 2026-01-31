import { ControllerBase } from '../../common/api';
import { IListParams, List, ListParams, PaginatedCollection } from '../../common/api/list';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PgaTournamentPlayer } from '../lib/pga-tournament-player.entity';
import { PgaTournamentPlayerService } from '../lib/pga-tournament-player.service';

import { PgaTournamentPlayerDto } from './pga-tournament-player.dto';

import {
  Controller,
  Logger,
  LoggerService,
  NotFoundException,
  Optional,
  Param,
} from '@nestjs/common';

@Controller('pga-tournaments/:pgaTournamentId/players')
export class PgaTournamentPlayerController extends ControllerBase {
  constructor(
    private readonly pgaTournamentPlayerService: PgaTournamentPlayerService,
    private readonly pgaTournamentService: PgaTournamentService,
    @Optional()
    protected readonly logger: LoggerService = new Logger(PgaTournamentPlayerController.name)
  ) {
    super(logger);
  }

  @List({
    page: {
      defaultPageSize: 250,
      maxPageSize: 250,
    },
  })
  async listPlayers(
    @Param('pgaTournamentId') pgaTournamentId: string,
    @ListParams() params: IListParams
  ): Promise<PaginatedCollection<PgaTournamentPlayerDto>> {
    this.logger.log(`Listing players for PGA Tournament ${pgaTournamentId}`);

    let tournament: PgaTournament | null;
    try {
      tournament = await this.pgaTournamentService.get(pgaTournamentId);
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error fetching PGA Tournament (ID: ${pgaTournamentId}): ${e}`);
      throw e;
    }

    if (!tournament) {
      throw new NotFoundException(`PGA Tournament (ID: ${pgaTournamentId}) not found`);
    }

    const result = (await this.pgaTournamentPlayerService.list(
      { tournamentId: tournament.id },
      {
        page: params.page,
        order: { score_total: 'ASC', pga_player: { name: 'ASC' } },
      }
    )) as PaginatedCollection<PgaTournamentPlayer>;

    return {
      ...result,
      data: result.data.map(PgaTournamentPlayerDto.fromEntity),
    };
  }
}
