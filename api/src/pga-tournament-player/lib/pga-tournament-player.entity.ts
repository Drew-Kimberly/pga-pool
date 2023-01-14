import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { PgaPlayer } from '../../pga-player/lib/pga-player.entity';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';

import { PlayerStatus } from './pga-tournament-player.interface';

@Entity('pga_tournament_player')
export class PgaTournamentPlayer {
  /** @note "{playerId}-{tournamentId} format" */
  @PrimaryColumn({ generated: false })
  id: string;

  @Column({ type: 'boolean' })
  active: boolean;

  @Column({ type: 'enum', enum: PlayerStatus })
  status: PlayerStatus;

  @Column({ type: 'boolean' })
  is_round_complete: boolean;

  @Column({ type: 'int', nullable: true })
  current_round: number | null;

  @Column({ type: 'int', nullable: true })
  current_hole: number | null;

  @Column({ type: 'int', default: 1 })
  starting_hole: number;

  @Column({ type: 'varchar', length: 16, nullable: true })
  tee_time: string | null;

  @Column({ type: 'int', nullable: true })
  score_total: number | null;

  @Column({ type: 'int', nullable: true })
  score_thru: number | null;

  @Column({ type: 'varchar', length: 16, nullable: true })
  current_position: string | null;

  @JoinColumn({ name: 'pga_player' })
  @ManyToOne(() => PgaPlayer, { eager: true })
  pga_player: PgaPlayer;

  @JoinColumn({ name: 'pga_tournament' })
  @ManyToOne(() => PgaTournament, { eager: true })
  pga_tournament: PgaTournament;
}
