import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from './user.entity';
import { Package } from '../../service/entities/package.entity';
import { ServiceGroup } from '../../service-group/entities/service-group.entity';

@Entity('user_subscription')
export class UserSubscription {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ nullable: true })
  packId: string;

  @ManyToOne(() => Package)
  @JoinColumn({ name: 'packId' })
  package: Package;

  @Column({ nullable: true })
  serviceGroupId: string;

  @ManyToOne(() => ServiceGroup)
  @JoinColumn({ name: 'serviceGroupId' })
  serviceGroup: ServiceGroup;

  @Column({ default: 0 })
  ac: number;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.userSubscriptions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'timestamp', nullable: true })
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
