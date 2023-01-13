import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { PoolTournamentPlayer } from '../../pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

@Entity('pool_user_pick')
@Unique(['pool_user', 'pool_tournament_player'])
export class PoolUserPick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'pool_user' })
  @ManyToOne(() => PoolUser, { eager: true, onDelete: 'CASCADE' })
  pool_user: PoolUser;

  @JoinColumn({ name: 'pool_tournament_player' })
  @ManyToOne(() => PoolTournamentPlayer, { eager: true, onDelete: 'CASCADE' })
  pool_tournament_player: PoolTournamentPlayer;
}
