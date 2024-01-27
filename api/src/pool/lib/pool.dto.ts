import { LeagueDto } from '../../league/lib/league.dto';

import { Pool } from './pool.entity';
import { PoolSettings, PoolType } from './pool.interface';

export class PoolDto {
  id: string;
  year: number;
  name: string;
  type: PoolType;
  settings: PoolSettings;
  league: LeagueDto;
  created_at: string;
  updated_at: string;

  static fromEntity(p: Pool): PoolDto {
    const dto = new PoolDto();

    dto.id = p.id;
    dto.year = p.year;
    dto.name = p.name;
    dto.type = p.type;
    dto.settings = p.settings;
    dto.league = LeagueDto.fromEntity(p.league);
    dto.created_at = p.created_at.toISOString();
    dto.updated_at = p.updated_at.toISOString();

    return dto;
  }
}
