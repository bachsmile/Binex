import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from '../../user/entities/user.entity';

@Entity('file_asset')
export class FileAsset {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  size: number; // Kích thước tệp (MB)

  @Column()
  mimetype: string;

  @Column()
  url: string;

  @Column({ type: 'char', length: 26, nullable: true })
  userId: string;

  @Column({ default: 'other' })
  category: string; // 'image', 'video', 'other'

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
