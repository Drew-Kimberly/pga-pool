import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { League } from '../../league/lib/league.entity';
import { User } from '../../user/lib/user.entity';

@Entity('league_user')
export class LeagueUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'league_id' })
  @ManyToOne(() => League, { eager: true, onDelete: 'CASCADE' })
  league: League;

  @Column({ type: 'uuid' })
  league_id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'bool', default: false })
  is_owner: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
