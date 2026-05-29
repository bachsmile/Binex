import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { MethodPay } from './method-pay.entity';
import { OrderType } from '../enums/order-type.enum';

export enum PaymentRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('payment')
export class Payment {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ nullable: true })
  packageId?: string;

  @Column({ nullable: true })
  serviceGroupId?: string;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.OTHER,
  })
  orderType: OrderType;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  methodPayId: string;

  @ManyToOne(() => MethodPay)
  @JoinColumn({ name: 'methodPayId' })
  methodPay: MethodPay;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  amount: number;

  @Column()
  transactionCode: string;

  @Column({ nullable: true })
  proofImage?: string;

  @Column({
    type: 'enum',
    enum: PaymentRequestStatus,
    default: PaymentRequestStatus.PENDING,
  })
  status: PaymentRequestStatus;

  @Column({ nullable: true })
  adminNote?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
