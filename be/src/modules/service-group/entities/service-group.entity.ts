import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { ulid } from 'ulid';
import { Permission } from '../../service/entities/permission.entity';

@Entity('service_group')
export class ServiceGroup {
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

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  priority: number;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => Permission, (p) => p.serviceGroup)
  permissions: Permission[];
}
