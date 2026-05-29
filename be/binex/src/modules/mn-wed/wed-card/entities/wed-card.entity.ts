import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Wed } from '../../wed/entities/wed.entity';

@Entity('wed_card')
export class WedCard {
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

  @Column()
  description: string;

  @Column()
  price: string;

  @Column()
  amount: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: false })
  autoSend: boolean;

  @Column({ type: 'integer', default: 1 })
  type: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'char', length: 26 })
  wedId: string;

  @OneToOne(() => Wed, (wedding) => wedding.card)
  @JoinColumn({ name: 'wedId' })
  wed: Wed;
}
