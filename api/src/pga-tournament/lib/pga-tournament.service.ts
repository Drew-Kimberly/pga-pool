import merge from 'deepmerge';
import { FindManyOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { PgaTournament } from './pga-tournament.entity';
import { SavePgaTournament } from './pga-tournament.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type SortDirection = 'ASC' | 'DESC';

interface ListParams {
  sort?: { field: string; direction?: SortDirection }[];
}

@Injectable()
export class PgaTournamentService {
  constructor(
    @InjectRepository(PgaTournament)
    private readonly pgaTournamentRepo: Repository<PgaTournament>
  ) {}

  list(params: ListParams = {}): Promise<PgaTournament[]> {
    const defaults: ListParams = { sort: [{ field: 'date.start' }] };
    const merged: ListParams = merge(defaults, params, { arrayMerge: (_, src) => src });
    const fieldMap: Record<string, string> = {
      'date.start': 'start_date',
    };

    const findOptions: FindManyOptions<PgaTournament> = {
      order: Object.fromEntries(
        (merged.sort ?? []).map((s) => [
          s.field in fieldMap ? fieldMap[s.field] : s.field,
          s.direction ?? 'ASC',
        ])
      ),
    };

    return this.pgaTournamentRepo.find(findOptions);
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
