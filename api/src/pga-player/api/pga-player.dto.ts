import { PgaPlayer } from '../lib/pga-player.entity';

export class PgaPlayerDto {
  id: number;
  name: string;
  short_name: string;
  first_name: string;
  last_name: string;
  active: boolean;
  headshot_url: string | null;

  static fromEntity(p: PgaPlayer): PgaPlayerDto {
    const dto = new PgaPlayerDto();

    dto.id = p.id;
    dto.name = p.name;
    dto.short_name = p.short_name;
    dto.first_name = p.first_name;
    dto.last_name = p.last_name;
    dto.active = p.active;
    dto.headshot_url = p.headshot_url;

    return dto;
  }
}
