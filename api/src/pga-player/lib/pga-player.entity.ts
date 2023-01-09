import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pga_player')
export class PgaPlayer {
  @PrimaryColumn({ generated: false })
  id: number;

  @Column({ type: 'text' })
  name: string;
}
