import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MicroService } from '../../micro-service/entities/micro-service.entity';
import { Service } from './service.entity';

@Entity('sv_micro')
export class SV_Micro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 26 })
  serviceId: string;

  @Column({ type: 'char', length: 26 })
  microId: string;

  @ManyToOne(() => MicroService)
  @JoinColumn({ name: 'microId' })
  micro: MicroService;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'serviceId' })
  service: Service;
}
