import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';

import { HoleScoreStatus } from './pga-tournament-player-hole.interface';

@Entity('pga_tournament_player_hole')
@Unique(['pga_tournament_player_id', 'round_number', 'hole_number'])
export class PgaTournamentPlayerHole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'pga_tournament_player_id' })
  @ManyToOne(() => PgaTournamentPlayer, { onDelete: 'CASCADE' })
  pga_tournament_player: PgaTournamentPlayer;

  @Column({ type: 'varchar' })
  pga_tournament_player_id: string;

  @Column({ type: 'int' })
  round_number: number;

  @Column({ type: 'int' })
  hole_number: number;

  @Column({ type: 'int' })
  par: number;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'int' })
  to_par: number;

  @Column({
    type: 'enum',
    enum: HoleScoreStatus,
    default: HoleScoreStatus.None,
  })
  status: HoleScoreStatus;

  @Column({ type: 'int' })
  yardage: number;

  @Column({ type: 'int' })
  sequence: number;
}
