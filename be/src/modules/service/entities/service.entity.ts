import { Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';
import { ulid } from 'ulid';

@Entity('service')
export class Service {
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

  @Column('text', { array: true, nullable: true })
  packageIds: string[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  priority: number;
}
