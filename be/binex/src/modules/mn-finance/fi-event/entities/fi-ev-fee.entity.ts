import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FiEvent } from './fi-event.entity';

@Entity('fi_ev_fee')
export class FiEvFee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  fee: number;

  @Column()
  point: number;

  @Column({ nullable: true })
  eventId: number;

  @ManyToOne(() => FiEvent, (event) => event.fees)
  @JoinColumn({ name: 'eventId' })
  event: FiEvent;

  @CreateDateColumn()
  createdAt: Date;
}
