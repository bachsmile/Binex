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

export enum PaymentRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('payment_request')
export class PaymentRequest {
  @PrimaryColumn({ length: 255 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column()
  orderId: string;

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
