import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CoerceNumericColumnTransformer } from '../../common/db';
import { League } from '../../league/lib/league.entity';
import { Pool } from '../../pool/lib/pool.entity';
import { User } from '../../user/lib/user.entity';

@Entity('pool_user')
export class PoolUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0,
    transformer: new CoerceNumericColumnTransformer(),
  })
  pool_score: number;

  @JoinColumn({ name: 'pool_id' })
  @ManyToOne(() => Pool, { eager: true, onDelete: 'CASCADE' })
  pool: Pool;

  @Column({ type: 'uuid' })
  pool_id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;

  @JoinColumn({ name: 'league_id' })
  @ManyToOne(() => League, { eager: true, onDelete: 'CASCADE' })
  league: League;

  @Column({ type: 'uuid' })
  league_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
