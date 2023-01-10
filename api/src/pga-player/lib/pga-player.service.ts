import { Repository } from 'typeorm';

import { PgaPlayer } from './pga-player.entity';
import { UpsertPgaPlayer } from './pga-player.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaPlayerService {
  constructor(
    @InjectRepository(PgaPlayer)
    private readonly pgaPlayerRepo: Repository<PgaPlayer>
  ) {}

  list(): Promise<PgaPlayer[]> {
    return this.pgaPlayerRepo.find();
  }

  get(pgaPlayerId: string | number): Promise<PgaPlayer | null> {
    return this.pgaPlayerRepo.findOneBy({ id: this.parsePlayerId(pgaPlayerId) });
  }

  upsert(pgaPlayer: UpsertPgaPlayer): Promise<PgaPlayer> {
    return this.pgaPlayerRepo.save({
      ...pgaPlayer,
      id: pgaPlayer.id ? this.parsePlayerId(pgaPlayer.id) : undefined,
    });
  }

  private parsePlayerId(id: number | string): number | never {
    const parsedId = Number(id);
    if (!(parsedId > 0)) {
      throw new Error(`Invalid PGA Player ID: ${id}`);
    }

    return parsedId;
  }
}
