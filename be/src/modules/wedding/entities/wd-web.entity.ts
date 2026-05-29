import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from '../../user/entities/user.entity';
import { Wedding } from './wedding.entity';

@Entity('wd_web')
export class WdWeb {
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

  @Column()
  description: string;

  @Column()
  userId: string;

  @Column()
  status: string;

  @Column()
  price: string;

  @Column()
  expire: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  deletedAt: Date;

  @Column()
  deletedBy: string;

  @Column()
  createdBy: string;

  @Column()
  updatedBy: string;

  @Column()
  isDeleted: boolean;

  @Column()
  wdId: string;

  @ManyToOne(() => User, (user) => user.wdWebs)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Wedding, (wedding) => wedding.wdWeb)
  @JoinColumn({ name: 'wdId' })
  wedding: Wedding;
}
