import { Column, Entity, PrimaryColumn, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { ulid } from 'ulid';
import { User } from '../../user/entities/user.entity';

export enum MethodPayType {
  ACCOUNT_NUMBER = 'account',
  BINEX = 'binex',
  CARD_NUMBER = 'card',
}

@Entity('method-pay')
export class MethodPay {
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
    enum: MethodPayType,
    default: MethodPayType.ACCOUNT_NUMBER,
  })
  type: MethodPayType;

  @Column()
  status: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.methodPays)
  @JoinColumn({ name: 'userId' })
  user: User;
}
