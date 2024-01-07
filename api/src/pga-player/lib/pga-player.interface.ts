import { PgaPlayer } from './pga-player.entity';

export interface SavePgaPlayer extends Omit<PgaPlayer, 'id'> {
  id: number | string;
}
