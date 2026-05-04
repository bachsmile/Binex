import { Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';
import { ulid } from 'ulid';

@Entity('package')
export class Package {
  @PrimaryColumn({ length: 255 })
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

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ nullable: true })
  serviceId: string;

  @Column({ nullable: true })
  ser: number;
}
