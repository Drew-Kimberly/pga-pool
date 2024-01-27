import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { League } from '../../league/lib/league.entity';
import { PoolTournament } from '../../pool-tournament/lib/pool-tournament.entity';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

import { PoolSettings, PoolType } from './pool.interface';

@Entity('pool')
export class Pool {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'citext' })
  name: string;

  @Column({ type: 'enum', enum: PoolType })
  type: PoolType;

  @Column({ type: 'jsonb' })
  settings: PoolSettings;

  @JoinColumn({ name: 'league_id' })
  @ManyToOne(() => League, { eager: true, onDelete: 'CASCADE' })
  league: League;

  @Column({ type: 'uuid' })
  league_id: string;

  @OneToMany(() => PoolTournament, (t) => t.pool)
  pool_tournaments: PoolTournament[];

  @OneToMany(() => PoolUser, (u) => u.pool)
  pool_users: PoolUser[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
