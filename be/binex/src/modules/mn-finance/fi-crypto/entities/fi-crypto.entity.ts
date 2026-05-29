import { CurrencyType } from 'src/constants/enum/currency.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FiStatusTransaction, FiTransactionType } from '../../enum/index.enum';

@Entity()
export class FiCrypto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 30, scale: 18 })
  quantity: number;

  @Column()
  userId: string;

  @Column()
  currency: CurrencyType;

  @Column()
  type: FiTransactionType;

  @Column()
  status: FiStatusTransaction;

  @Column('decimal', { precision: 30, scale: 18 })
  initPrice: number;

  @Column('decimal', { precision: 30, scale: 18 })
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
