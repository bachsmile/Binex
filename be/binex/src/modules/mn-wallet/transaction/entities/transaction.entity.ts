import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyType } from '../../../../constants/enum/currency.enum';
import {
  MethodTranslateEnum,
  StatusTranslateEnum,
  TypeTranslateEnum,
} from '../enum/type-translate.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: TypeTranslateEnum;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  currency: CurrencyType;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  method: MethodTranslateEnum;

  @Column()
  status: StatusTranslateEnum;

  @CreateDateColumn()
  createdAt: Date;
}
