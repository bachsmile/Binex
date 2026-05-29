import { Package } from 'src/modules/mn-service/packages/entities/package.entity';
import { Service } from 'src/modules/mn-service/service/entities/service.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from './user.entity';

@Entity('user_micro')
export class UserMicro {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ type: 'char', length: 26, nullable: true })
  packId: string;

  @ManyToOne(() => Package)
  @JoinColumn({ name: 'packId' })
  package: Package;

  @Column({ type: 'char', length: 26, nullable: true })
  serviceId: string;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column({ type: 'char', length: 26 })
  userId: string;

  @ManyToOne(() => User, (user) => user.userMicros)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', nullable: true })
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
