import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import {
  IListParams,
  Listable,
  PaginatedCollection,
  TypeOrmListService,
} from '../../common/api/list';

import { PgaTournament } from './pga-tournament.entity';
import { SavePgaTournament } from './pga-tournament.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaTournamentService implements Listable<PgaTournament> {
  constructor(
    @InjectRepository(PgaTournament)
    private readonly pgaTournamentRepo: Repository<PgaTournament>,
    private readonly listService: TypeOrmListService<PgaTournament>
  ) {}

  async list(
    params: IListParams,
    fieldMap: Record<string, string> = {}
  ): Promise<PaginatedCollection<PgaTournament>> {
    return this.listService.list(params, {
      entityType: PgaTournament,
      fieldMap,
      onFindOptions: (opts) => (opts.order = { start_date: 'ASC' }),
    });
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
