import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
