import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CoerceNumericColumnTransformer } from '../../common/db';
import { League } from '../../league/lib/league.entity';
import { PoolTournament } from '../../pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentUserPick } from '../../pool-tournament-user-pick/lib/pool-tournament-user-pick.entity';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

@Entity('pool_tournament_user')
export class PoolTournamentUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  tournament_score: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
    default: 0,
    transformer: new CoerceNumericColumnTransformer(),
  })
  fedex_cup_points: number;

  @OneToMany(() => PoolTournamentUserPick, (pick) => pick.pool_tournament_user)
  picks: PoolTournamentUserPick[];

  @JoinColumn({ name: 'pool_tournament_id' })
  @ManyToOne(() => PoolTournament, { eager: true, onDelete: 'CASCADE' })
  pool_tournament: PoolTournament;

  @Column({ type: 'uuid' })
  pool_tournament_id: string;

  @JoinColumn({ name: 'pool_user_id' })
  @ManyToOne(() => PoolUser, { eager: true, onDelete: 'CASCADE' })
  pool_user: PoolUser;

  @Column({ type: 'uuid' })
  pool_user_id: string;

  @JoinColumn({ name: 'league_id' })
  @ManyToOne(() => League, { eager: true, onDelete: 'CASCADE' })
  league: League;

  @Column({ type: 'uuid' })
  league_id: string;
}
