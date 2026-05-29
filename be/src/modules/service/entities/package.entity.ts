import {
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ulid } from 'ulid';
import { Service } from './service.entity';

@Entity('package')
export class Package {
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

  @Column({ unique: true, nullable: true })
  code: string;

  @Column()
  description: string;

  @Column()
  price: string;

  @Column()
  isGroup: boolean;

  @Column()
  amountGroup: number;

  @Column({ nullable: true })
  sale?: number;

  @Column()
  expire: number;

  @Column({ default: 0 })
  storageLimit: number; // Dung lượng tối đa (MB), 0 là không giới hạn

  @Column({ type: 'json', default: {} })
  recordLimit: any; // Giới hạn bản ghi theo từng loại { "key": limit }

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'package_service',
    joinColumn: { name: 'package_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];
}
