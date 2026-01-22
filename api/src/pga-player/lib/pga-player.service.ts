import { Like, Repository } from 'typeorm';

import { IListParams, PaginatedCollection } from '../../common/api/list';
import { TypeOrmListService } from '../../common/api/list/service';

import { PgaPlayer } from './pga-player.entity';
import { SavePgaPlayer } from './pga-player.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaPlayerService {
  constructor(
    @InjectRepository(PgaPlayer)
    private readonly pgaPlayerRepo: Repository<PgaPlayer>,
    private readonly listService: TypeOrmListService<PgaPlayer>
  ) {}

  list(opts: { filter?: { name?: string } } = {}): Promise<PgaPlayer[]> {
    return this.pgaPlayerRepo.find({
      where: opts.filter ? { name: Like(`%${opts.filter.name}%` ?? '') } : {},
    });
  }

  listPaginated(params: IListParams): Promise<PaginatedCollection<PgaPlayer>> {
    // Apply default active=true filter if not explicitly provided
    const paramsWithDefaults: IListParams = {
      ...params,
      filter: {
        active: true,
        ...params.filter,
      },
    };

    return this.listService.list(paramsWithDefaults, {
      entityType: PgaPlayer,
      onFindOptions: (opts) => {
        opts.order = { name: 'ASC' };
      },
    });
  }

  get(pgaPlayerId: string | number): Promise<PgaPlayer | null> {
    return this.pgaPlayerRepo.findOneBy({ id: this.parsePlayerId(pgaPlayerId) });
  }

  save(payload: SavePgaPlayer[]): Promise<PgaPlayer[]> {
    return this.pgaPlayerRepo.save(
      payload.map((p) => ({
        ...p,
        id: this.parsePlayerId(p.id),
      }))
    );
  }

  private parsePlayerId(id: number | string): number | never {
    const parsedId = Number(id);
    if (!(parsedId > 0)) {
      throw new Error(`Invalid PGA Player ID: ${id}`);
    }

    return parsedId;
  }
}
