import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FiEvent } from './fi-event.entity';

@Entity('fi_ev_token')
export class FiEvToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @Column()
  point: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  price: number;

  @Column({ nullable: true })
  eventId: number;

  @ManyToOne(() => FiEvent, (event) => event.tokens)
  @JoinColumn({ name: 'eventId' })
  event: FiEvent;

  @CreateDateColumn()
  createdAt: Date;
}
