import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';
import { PoolTournament } from '../../pool-tournament/lib/pool-tournament.entity';

@Entity('pool_tournament_player')
export class PoolTournamentPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  tier: number;

  @JoinColumn({ name: 'pga_tournament_player' })
  @OneToOne(() => PgaTournamentPlayer, { eager: true })
  pga_tournament_player: PgaTournamentPlayer;

  @JoinColumn({ name: 'pool_tournament' })
  @ManyToOne(() => PoolTournament, { eager: true, onDelete: 'CASCADE' })
  pool_tournament: PoolTournament;
}
