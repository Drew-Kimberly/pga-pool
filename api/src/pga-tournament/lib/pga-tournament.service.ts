import { FindManyOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { IListParams, Listable, PaginatedCollection } from '../../common/api/list';

import { PgaTournament } from './pga-tournament.entity';
import { SavePgaTournament } from './pga-tournament.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type SortDirection = 'ASC' | 'DESC';

interface ListParams {
  sort?: { field: string; direction?: SortDirection }[];
}

@Injectable()
export class PgaTournamentService implements Listable<PgaTournament> {
  constructor(
    @InjectRepository(PgaTournament)
    private readonly pgaTournamentRepo: Repository<PgaTournament>
  ) {}

  async list(params: IListParams): Promise<PaginatedCollection<PgaTournament>> {
    // const defaults: ListParams = { sort: [{ field: 'date.start' }] };
    // const merged = deepMerge(defaults, params);
    // const fieldMap: Record<string, string> = {
    //   'date.start': 'start_date',
    // };

    // const findOptions: FindManyOptions<PgaTournament> = {
    //   order: Object.fromEntries(
    //     (merged.sort ?? []).map((s) => [
    //       s.field in fieldMap ? fieldMap[s.field] : s.field,
    //       s.direction ?? 'ASC',
    //     ])
    //   ),
    // };

    const limit = params.page.size;
    const offset = (params.page.number - 1) * limit;

    const findOptions: FindManyOptions<PgaTournament> = {
      order: { start_date: 'ASC' },
      take: limit,
      skip: offset,
    };

    const [tourneys, total] = await this.pgaTournamentRepo.findAndCount(findOptions);

    return {
      data: tourneys,
      meta: {
        number: params.page.number,
        requested_size: params.page.size,
        actual_size: tourneys.length,
        total,
      },
    };
  }

  get(pgaTournamentId: string): Promise<PgaTournament | null> {
    return this.pgaTournamentRepo.findOneBy({ id: pgaTournamentId });
  }

  async getCurrent(pgaTournamentId?: string): Promise<PgaTournament | null> {
    const now = new Date(Date.now());

    return this.pgaTournamentRepo.findOneBy({
      start_date: LessThanOrEqual(now),
      end_date: MoreThanOrEqual(now),
      ...(pgaTournamentId ? { id: pgaTournamentId } : {}),
    });
  }

  save(payload: SavePgaTournament[]): Promise<PgaTournament[]> {
    return this.pgaTournamentRepo.save(payload);
  }
}
