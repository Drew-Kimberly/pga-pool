import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

@Entity('pool_user_pick')
@Unique(['pool_user', 'pga_tournament_player'])
export class PoolUserPick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'pool_user' })
  @ManyToOne(() => PoolUser, { eager: true })
  pool_user: PoolUser;

  @JoinColumn({ name: 'pga_tournament_player' })
  @ManyToOne(() => PgaTournamentPlayer, { eager: true })
  pga_tournament_player: PgaTournamentPlayer;
}
