import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';

export enum WeddingServiceType {
  CARD = 'card',
  WEB = 'web',
  ALL = 'all',
}

@Entity('wedding-package')
export class WeddingPackage {
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

  @Column({
    type: 'enum',
    enum: WeddingServiceType,
    default: WeddingServiceType.CARD,
  })
  type: WeddingServiceType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  priceCardInit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  priceWebInit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  priceGiftInit: number;

  @Column({ nullable: true })
  amountCard: number;

  @Column({ nullable: true })
  amountWeb: number;

  @Column({ nullable: true })
  amountGiftInit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description: string;

  @Column({ nullable: true })
  @IsOptional()
  isMnWedding: boolean;

  @Column({ nullable: true })
  @IsOptional()
  isMnGift: boolean;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
