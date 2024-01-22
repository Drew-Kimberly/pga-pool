import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'citext' })
  name: string;

  @Column({ type: 'citext', nullable: true })
  nickname: string | null;

  @Column({ type: 'citext', nullable: true })
  email: string | null;

  @Column({ type: 'bool', default: false })
  is_admin: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
