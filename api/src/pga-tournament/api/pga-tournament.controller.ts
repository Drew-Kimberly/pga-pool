import { ControllerBase } from '../../common/api';
import {
  IListParams,
  List,
  Listable,
  ListParams,
  PaginatedCollection,
} from '../../common/api/list';
import { FieldFilterSchema } from '../../common/api/list/schema';
import { PgaTournament } from '../lib/pga-tournament.entity';
import { PgaTournamentScoringFormat, PgaTournamentStatus } from '../lib/pga-tournament.interface';
import { PgaTournamentService } from '../lib/pga-tournament.service';

import { PgaTournamentDto } from './pga-tournament.dto';
import { TournamentDateFieldFilter } from './tournament-date-field-filter';

import { Controller } from '@nestjs/common';

@Controller('pga-tournaments')
export class PgaTournamentController extends ControllerBase implements Listable<PgaTournamentDto> {
  constructor(private readonly pgaTournamentService: PgaTournamentService) {
    super();
  }

  @List({
    filter: {
      name: FieldFilterSchema.string(),
      date: TournamentDateFieldFilter.build(),
      fedex_cup_event: FieldFilterSchema.boolean(),
      scoring_format: FieldFilterSchema.enum(PgaTournamentScoringFormat),
      tournament_status: FieldFilterSchema.enum(PgaTournamentStatus),
    },
  })
  async list(@ListParams() params: IListParams): Promise<PaginatedCollection<PgaTournamentDto>> {
    let result: PaginatedCollection<PgaTournament>;
    try {
      result = await this.pgaTournamentService.list(params, {
        'date.year': 'year',
        'date.start': 'start_date',
        'date.end': 'end_date',
      });
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
