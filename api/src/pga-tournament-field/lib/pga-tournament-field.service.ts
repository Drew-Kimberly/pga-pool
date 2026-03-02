import { Repository } from 'typeorm';

import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';

import { PgaTournamentFieldPlayer } from './pga-tournament-field.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaTournamentFieldService {
  constructor(
    @InjectRepository(PgaTournamentPlayer)
    private readonly pgaTournamentPlayerRepo: Repository<PgaTournamentPlayer>
  ) {}

  async getPlayers(pgaTournamentId: string): Promise<PgaTournamentFieldPlayer[]> {
    const players = await this.pgaTournamentPlayerRepo.find({
      where: { pga_tournament: { id: pgaTournamentId } },
      relations: ['pga_player'],
      order: { pga_player: { name: 'ASC' } },
    });

    return players.map((p) => ({
      player_id: p.pga_player.id,
      name: p.pga_player.name,
    }));
  }
}
