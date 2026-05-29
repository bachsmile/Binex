import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceGroup } from '../../service-group/entities/service-group.entity';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceGroupId: string;

  @Column()
  action: string; // user.read, user.create, landing_page.edit

  @Column({ type: 'int' })
  weight: number; // 1, 2, 4, 8

  @ManyToOne(() => ServiceGroup, (sg) => sg.permissions)
  @JoinColumn({ name: 'serviceGroupId' })
  serviceGroup: ServiceGroup;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
