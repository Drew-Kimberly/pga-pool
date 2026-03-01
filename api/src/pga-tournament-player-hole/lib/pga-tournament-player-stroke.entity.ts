import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { CoerceNumericColumnTransformer } from '../../common/db';

import { PgaTournamentPlayerHole } from './pga-tournament-player-hole.entity';
import { StrokeType } from './pga-tournament-player-hole.interface';

@Entity('pga_tournament_player_stroke')
@Unique(['pga_tournament_player_hole_id', 'stroke_number'])
export class PgaTournamentPlayerStroke {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'pga_tournament_player_hole_id' })
  @ManyToOne(() => PgaTournamentPlayerHole, { onDelete: 'CASCADE' })
  pga_tournament_player_hole: PgaTournamentPlayerHole;

  @Column({ type: 'uuid' })
  pga_tournament_player_hole_id: string;

  @Column({ type: 'int' })
  stroke_number: number;

  @Column({ type: 'varchar', length: 64 })
  from_location: string;

  @Column({ type: 'varchar', length: 16 })
  from_location_code: string;

  @Column({ type: 'varchar', length: 64 })
  to_location: string;

  @Column({ type: 'varchar', length: 16 })
  to_location_code: string;

  @Column({ type: 'enum', enum: StrokeType, default: StrokeType.Stroke })
  stroke_type: StrokeType;

  @Column({ type: 'varchar', length: 32, nullable: true })
  distance: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  distance_remaining: string | null;

  @Column({ type: 'text', nullable: true })
  play_by_play: string | null;

  @Column({ type: 'boolean', default: false })
  is_final_stroke: boolean;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  ball_speed: number | null;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  club_speed: number | null;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 3,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  smash_factor: number | null;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  launch_angle: number | null;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  launch_spin: number | null;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  spin_axis: number | null;

  @Column({
    type: 'decimal',
    precision: 7,
    scale: 2,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  apex_height: number | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  start_x: number | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  start_y: number | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  end_x: number | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
    nullable: true,
    transformer: new CoerceNumericColumnTransformer(),
  })
  end_y: number | null;
}
