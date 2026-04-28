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

@Entity('wd_card')
export class WdCard {
  @PrimaryColumn({ length: 255 })
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
  price: string;

  @Column()
  amount: number;

  @Column()
  userId: string;

  @Column()
  status: string;

  @Column()
  createdAt: Date;

  @Column()
  wdId: string;

  @ManyToOne(() => User, (user) => user.wdCards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Wedding, (wedding) => wedding.wdCard)
  @JoinColumn({ name: 'wdId' })
  wedding: Wedding;
}
