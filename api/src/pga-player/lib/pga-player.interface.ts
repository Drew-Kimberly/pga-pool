import { PgaPlayer } from './pga-player.entity';

export interface UpsertPgaPlayer extends Omit<PgaPlayer, 'id'> {
  id?: number | string;
}
