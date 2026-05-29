import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';

@Entity('micro_service')
export class MicroService {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  code: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  priority: number;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: 'active' })
  status: string;
}
