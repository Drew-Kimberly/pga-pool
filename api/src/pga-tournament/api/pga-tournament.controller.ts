import { ControllerBase } from '../../common/api';
import {
  IListParams,
  List,
  Listable,
  ListParams,
  PaginatedCollection,
} from '../../common/api/list';
import { PgaTournament } from '../lib/pga-tournament.entity';
import { PgaTournamentService } from '../lib/pga-tournament.service';

import { PgaTournamentDto } from './pga-tournament.dto';

import { Controller } from '@nestjs/common';

@Controller('pga-tournaments')
export class PgaTournamentController extends ControllerBase implements Listable<PgaTournamentDto> {
  constructor(private readonly pgaTournamentService: PgaTournamentService) {
    super();
  }

  @List()
  async list(@ListParams() params: IListParams): Promise<PaginatedCollection<PgaTournamentDto>> {
    let result: PaginatedCollection<PgaTournament>;
    try {
      result = await this.pgaTournamentService.list(params);
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error listing pga tournaments: ${e}`);
      throw e;
    }

    return {
      ...result,
      data: result.data.map(PgaTournamentDto.fromEntity),
    };
  }
}
