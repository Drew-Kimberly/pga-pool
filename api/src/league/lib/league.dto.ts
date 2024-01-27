import { League } from './league.entity';

export class LeagueDto {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;

  static fromEntity(l: League): LeagueDto {
    const dto = new LeagueDto();

    dto.id = l.id;
    dto.name = l.name;
    dto.created_at = l.created_at.toISOString();
    dto.updated_at = l.updated_at.toISOString();

    return dto;
  }
}
