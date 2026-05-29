import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Package } from '../../packages/entities/package.entity';
import { Service } from './service.entity';

@Entity('sv_pk')
export class Sv_Pk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 26 })
  packageId: string;

  @Column({ type: 'char', length: 26 })
  serviceId: string;

  @ManyToOne(() => Package)
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @ManyToOne(() => Service)
  @JoinColumn({ name: 'serviceId' })
  service: Service;
}
