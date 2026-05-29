import { CurrencyType } from 'src/constants/enum/currency.enum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { FiStatusTransaction, FiTransactionType } from '../../enum/index.enum';

@Entity('fi_money')
export class FiMoney {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ type: 'char', length: 26 })
  userId: string;

  @Column({ type: 'char', length: 26 })
  walletId: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  currency: CurrencyType; // VND, USDT...

  @Column({
    type: 'enum',
    enum: FiTransactionType,
    default: FiTransactionType.DEPOSIT,
  })
  type: FiTransactionType;

  @Column({
    type: 'enum',
    enum: FiStatusTransaction,
    default: FiStatusTransaction.SUCCESS,
  })
  status: FiStatusTransaction;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
