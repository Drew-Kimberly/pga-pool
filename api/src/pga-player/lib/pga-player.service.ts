import { Like, Repository } from 'typeorm';

import { PgaPlayer } from './pga-player.entity';
import { SavePgaPlayer } from './pga-player.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaPlayerService {
  constructor(
    @InjectRepository(PgaPlayer)
    private readonly pgaPlayerRepo: Repository<PgaPlayer>
  ) {}

  list(opts: { filter?: { name?: string } } = {}): Promise<PgaPlayer[]> {
    return this.pgaPlayerRepo.find({
      where: opts.filter ? { name: Like(`%${opts.filter.name}%` ?? '') } : {},
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
