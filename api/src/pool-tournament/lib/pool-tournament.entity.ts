import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

@Entity('pool_tournament')
export class PoolTournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean' })
  active: boolean;

  @JoinColumn({ name: 'pga_tournament' })
  @OneToOne(() => PgaTournament, {
    eager: true,
    nullable: false,
  })
  pga_tournament: PgaTournament;

  @OneToMany(() => PoolUser, (poolUser) => poolUser.pool_tournament)
  pool_users: PoolUser[];
}
