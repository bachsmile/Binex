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

@Entity('wed_web')
export class WedWeb {
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

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'integer', default: 1 })
  type: number;

  @Column()
  price: string;

  @Column({ default: 365 })
  expire: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string | null;

  @Column({ type: 'char', length: 26 })
  wedId: string;

  @OneToOne(() => Wed, (wedding) => wedding.web)
  @JoinColumn({ name: 'wedId' })
  wed: Wed;
}
