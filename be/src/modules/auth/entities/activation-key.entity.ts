import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Role } from '../../../decorators/roles.decorator';

@Entity('activation_key')
export class ActivationKey {
  @PrimaryColumn({ length: 255 })
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
  serviceId: string;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ nullable: true })
  usedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
