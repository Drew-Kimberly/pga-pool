import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { League } from '../../league/lib/league.entity';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { Pool } from '../../pool/lib/pool.entity';
import { PoolTournamentUser } from '../../pool-tournament-user/lib/pool-tournament-user.entity';

@Entity('pool_tournament')
export class PoolTournament {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'pool_id' })
  @ManyToOne(() => Pool, {
    eager: true,
    onDelete: 'CASCADE',
  })
  pool: Pool;

  @Column({ type: 'uuid' })
  pool_id: string;

  @OneToMany(() => PoolTournamentUser, (u) => u.pool_tournament)
  pool_tournament_users: PoolTournamentUser[];

  @JoinColumn({ name: 'pga_tournament_id' })
  @OneToOne(() => PgaTournament, {
    eager: true,
  })
  pga_tournament: PgaTournament;

  @Column({ type: 'uuid' })
  pga_tournament_id: string;

  @JoinColumn({ name: 'league_id' })
  @ManyToOne(() => League, {
    eager: true,
  })
  league: League;

  @Column({ type: 'uuid' })
  league_id: string;
}
