import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MicroService } from '../../micro-service/entities/micro-service.entity';
import { Package } from './package.entity';

@Entity('pk_micro')
export class PK_Micro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 26 })
  packageId: string;

  @Column({ type: 'char', length: 26 })
  microId: string;

  @ManyToOne(() => Package)
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @ManyToOne(() => MicroService)
  @JoinColumn({ name: 'microId' })
  micro: MicroService;
}
