import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { PoolTournamentPlayer } from '../../pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolTournamentUser } from '../../pool-tournament-user/lib/pool-tournament-user.entity';

@Entity('pool_tournament_user_pick')
@Unique(['pool_tournament_user', 'pool_tournament_player'])
export class PoolTournamentUserPick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'pool_tournamnet_user_id' })
  @ManyToOne(() => PoolTournamentUser, { eager: true, onDelete: 'CASCADE' })
  pool_tournament_user: PoolTournamentUser;

  @Column({ type: 'uuid' })
  pool_tournamnet_user_id: string;

  @JoinColumn({ name: 'pool_tournament_player_id' })
  @ManyToOne(() => PoolTournamentPlayer, { eager: true, onDelete: 'CASCADE' })
  pool_tournament_player: PoolTournamentPlayer;

  @Column({ type: 'uuid' })
  pool_tournament_player_id: string;
}
