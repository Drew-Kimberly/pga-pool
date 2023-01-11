import { Column, Entity, PrimaryColumn } from 'typeorm';

import { PgaTournamentFormat } from './pga-tournament.interface';

@Entity('pga_tournament')
export class PgaTournament {
  /**
   * @note in format of "{tournamentId}-{year}"
   */
  @PrimaryColumn({ generated: false })
  id: string;

  @Column({ type: 'citext' })
  full_name: string;

  @Column({ type: 'citext' })
  short_name: string;

  @Column({ type: 'varchar', length: 32 })
  tournament_id: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  week_number: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'enum', enum: PgaTournamentFormat })
  format: PgaTournamentFormat;

  @Column({ type: 'int' })
  fedex_cup_purse: number;

  @Column({ type: 'int' })
  fedex_cup_winner_points: number;
}
