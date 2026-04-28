import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { ulid } from 'ulid';

@Entity()
export class Wallet {
  @PrimaryColumn({ length: 255 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column()
  name: string;

  @Column('jsonb', { default: { VND: 0, USD: 0 } })
  balance: Record<string, number>;

  @Column({ unique: true })
  userId: string;

  @Column({ nullable: true })
  status: string;

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

  @Column()
  pin: string;

  @Column({ unique: true })
  address: string;

  @Column({ unique: true })
  privateKey: string;

  @Column({ unique: true })
  publicKey: string;
}
