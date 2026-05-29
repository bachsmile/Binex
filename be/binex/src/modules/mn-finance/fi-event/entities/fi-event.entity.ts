import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FiEvFee } from './fi-ev-fee.entity';
import { FiEvToken } from './fi-ev-token.entity';

@Entity('fi_event')
export class FiEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => FiEvFee, (fee) => fee.event)
  fees: FiEvFee[];

  @OneToMany(() => FiEvToken, (token) => token.event)
  tokens: FiEvToken[];
}
