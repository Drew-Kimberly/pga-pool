import { Column, Entity, PrimaryColumn } from 'typeorm';

import {
  PgaTournamentFeatures,
  PgaTournamentRoundStatus,
  PgaTournamentScoringFormat,
  PgaTournamentStatus,
} from './pga-tournament.interface';

@Entity('pga_tournament')
export class PgaTournament {
  /**
   * @note in format of "R${year}${tournamentId}"
   */
  @PrimaryColumn({ generated: false })
  id: string;

  @Column({ type: 'citext' })
  name: string;

  /**
   * @note tournament ID without the year prefix
   */
  @Column({ type: 'varchar', length: 32 })
  tournament_id: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'varchar', length: 32 })
  month: string;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @Column({ type: 'varchar', length: 64 })
  timezone: string;

  @Column({ type: 'varchar', length: 128 })
  display_date: string;

  @Column({ type: 'varchar', length: 64 })
  display_date_short: string;

  @Column({ type: 'int' })
  purse: number;

  @Column({ type: 'jsonb', default: [] })
  features: PgaTournamentFeatures[];

  @Column({ type: 'int', nullable: true })
  fedex_cup_points: number | null;

  @Column({ type: 'boolean' })
  fedex_cup_event: boolean;

  @Column({ type: 'boolean', default: false })
  official_fedex_cup_points_calculated: boolean;

  @Column({ type: 'varchar', length: 64 })
  scoring_format: PgaTournamentScoringFormat;

  @Column({ type: 'varchar', length: 64 })
  tournament_status: PgaTournamentStatus;

  @Column({ type: 'varchar', length: 64 })
  round_status: PgaTournamentRoundStatus;

  /** @note null when tournament is upcoming */
  @Column({ type: 'int', nullable: true })
  current_round: number | null;

  @Column({ type: 'citext' })
  course_name: string;

  @Column({ type: 'citext' })
  country: string;

  @Column({ type: 'varchar', length: 16 })
  country_code: string;

  @Column({ type: 'citext' })
  state: string;

  @Column({ type: 'varchar', length: 16 })
  state_code: string;

  @Column({ type: 'citext' })
  city: string;

  @Column({ type: 'citext', nullable: true })
  previous_champion: string | null;

  @Column({ type: 'int', nullable: true })
  previous_champion_id: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo_url: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  course_url: string | null;
}
