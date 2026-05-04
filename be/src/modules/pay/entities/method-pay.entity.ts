import { Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';
import { ulid } from 'ulid';

export enum MethodPayType {
  ACCOUNT_NUMBER = 'account',
  CARD_NUMBER = 'card',
}

@Entity('method-pay')
export class MethodPay {
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

  @Column()
  bankNumber: string;

  @Column()
  cardNumber: string;

  @Column()
  accountHolderName: string;

  @Column()
  bankName: string;

  @Column()
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
}
