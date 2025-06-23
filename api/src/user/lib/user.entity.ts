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

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  auth0_id: string | null;

  @Column({ type: 'text', nullable: true })
  picture_url: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  last_login: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  auth_provider: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
