import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryColumn({ generated: false })
  id: string;

  @Column({ type: 'citext' })
  name: string;

  @Column({ type: 'citext' })
  nickname: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
