import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('pga_player')
export class PgaPlayer {
  @PrimaryColumn({ generated: false })
  id: number;

  @Column({ type: 'citext' })
  @Index()
  name: string;
}
