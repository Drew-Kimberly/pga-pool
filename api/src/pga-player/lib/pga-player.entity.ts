import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('pga_player')
export class PgaPlayer {
  @PrimaryColumn({ generated: false })
  id: number;

  @Column({ type: 'citext' })
  @Index()
  name: string;

  @Column({ type: 'citext' })
  @Index()
  short_name: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'citext' })
  first_name: string;

  @Column({ type: 'citext' })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  headshot_url: string | null;
}
