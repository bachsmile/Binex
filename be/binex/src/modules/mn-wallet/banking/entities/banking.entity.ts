import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { TypeBank } from '../enum/type.enum';
import { User } from 'src/modules/mn-user/user/entities/user.entity';

@Entity()
export class Banking {
  @ApiProperty()
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }
  @Column({ unique: true })
  address: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  bankNumber: string;

  @Column({ nullable: true })
  cardNumber: string;

  @Column()
  accountHolderName: string;

  @Column()
  bankName: string;

  @Column({ nullable: true })
  QRCode: string;

  @Column()
  code: string;

  @Column({
    type: 'enum',
    enum: TypeBank,
    default: TypeBank.ACCOUNT_NUMBER,
  })
  type: TypeBank;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'char', length: 26, nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.bankings)
  @JoinColumn({ name: 'userId' })
  user: User;
}
