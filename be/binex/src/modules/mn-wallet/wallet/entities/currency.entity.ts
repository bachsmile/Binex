import { User } from 'src/modules/mn-user/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyType } from '../../../../constants/enum/currency.enum';
import { Wallet } from './wallet.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: CurrencyType;

  @Column({ default: 0 })
  balance: number;

  @Column({ type: 'char', length: 26 })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'char', length: 26 })
  walletId: string;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;
}
