import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';

export enum FeeType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

@Entity('platform_fee')
export class PfFee {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ unique: true })
  code: string; // Mã định danh (ví dụ: VAT, PLATFORM_COMMISSION)

  @Column()
  name: string; // Tên hiển thị

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: FeeType,
    default: FeeType.PERCENTAGE,
  })
  type: FeeType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number; // Giá trị (ví dụ: 10.00 cho 10%)

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
