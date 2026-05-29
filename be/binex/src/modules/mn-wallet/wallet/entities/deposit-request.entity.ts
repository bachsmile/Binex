import { User } from 'src/modules/mn-user/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { CurrencyType } from '../../../../constants/enum/currency.enum';

export enum DepositRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('deposit_request')
export class DepositRequest {
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  walletAddress: string;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  amount: number;

  @Column({
    type: 'enum',
    enum: CurrencyType,
  })
  currency: CurrencyType;

  @Column({ type: 'varchar', nullable: true })
  proofImage: string;

  @Column({ type: 'varchar', nullable: true })
  transactionCode: string;

  @Column({
    type: 'enum',
    enum: DepositRequestStatus,
    default: DepositRequestStatus.PENDING,
  })
  status: DepositRequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
