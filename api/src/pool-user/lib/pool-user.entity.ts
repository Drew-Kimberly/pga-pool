import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PoolTournament } from '../../pool-tournament/lib/pool-tournament.entity';
import { PoolUserPick } from '../../pool-user-pick/lib/pool-user-pick.entity';
import { User } from '../../user/lib/user.entity';

@Entity('pool_user')
export class PoolUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  score: number | null;

  @OneToMany(() => PoolUserPick, (pick) => pick.pool_user)
  picks: PoolUserPick[];

  @JoinColumn({ name: 'pool_tournament' })
  @ManyToOne(() => PoolTournament, { eager: true })
  pool_tournament: PoolTournament;

  @JoinColumn({ name: 'user' })
  @ManyToOne(() => User, {
    eager: true,
    nullable: false,
  })
  user: User;
}
