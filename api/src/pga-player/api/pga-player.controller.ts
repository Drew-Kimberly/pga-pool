import { ControllerBase } from '../../common/api';
import {
  IListParams,
  List,
  Listable,
  ListParams,
  PaginatedCollection,
} from '../../common/api/list';
import { FieldFilterSchema } from '../../common/api/list/schema';
import { PgaPlayer } from '../lib/pga-player.entity';
import { PgaPlayerService } from '../lib/pga-player.service';

import { PgaPlayerDto } from './pga-player.dto';

import { Controller } from '@nestjs/common';

@Controller('pga-players')
export class PgaPlayerController extends ControllerBase implements Listable<PgaPlayerDto> {
  constructor(private readonly pgaPlayerService: PgaPlayerService) {
    super();
  }

  @List({
    page: { defaultPageSize: 500, maxPageSize: 500 },
    filter: {
      name: FieldFilterSchema.string(),
      active: FieldFilterSchema.boolean(),
    },
  })
  async list(@ListParams() params: IListParams): Promise<PaginatedCollection<PgaPlayerDto>> {
    let result: PaginatedCollection<PgaPlayer>;
    try {
      result = await this.pgaPlayerService.listPaginated(params);
    } catch (e) {
      this.logErrorSkipping4xx(e as Error, `Error listing pga players: ${e}`);
      throw e;
    }

    return {
      ...result,
      data: result.data.map(PgaPlayerDto.fromEntity),
    };
  }
}
