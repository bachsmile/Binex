import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Role } from '../enums/role.enum';

@Entity('activation_key')
export class ActivationKey {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ unique: true })
  key: string;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: true,
  })
  role?: Role;

  @Column({ nullable: true })
  days?: number;

  @Column()
  packageId: string;

  @Column()
  serviceGroupId: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ nullable: true })
  usedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
