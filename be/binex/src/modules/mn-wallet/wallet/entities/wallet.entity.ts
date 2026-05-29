import { User } from 'src/modules/mn-user/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { ulid } from 'ulid';
import { Currency } from './currency.entity';
import { Status } from '../enum/wallet.enum';

@Entity()
export class Wallet {
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

  @Column({ nullable: true })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  deletedBy: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: false })
  isAdminWallet: boolean;

  @Column()
  pin: string;

  @Column({ unique: true })
  address: string;

  @Column({ unique: true })
  privateKey: string;

  @Column({ unique: true })
  publicKey: string;

  @Column({ type: 'char', length: 26, nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Currency, (currency) => currency.wallet)
  balances: Currency[];
}
