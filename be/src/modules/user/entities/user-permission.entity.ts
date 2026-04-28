import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from './user.entity';

@Entity('user_permission')
export class UserPermission {
  @PrimaryColumn({ length: 255 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ nullable: true })
  serId: string;

  @Column({ nullable: true })
  serName: string;

  @Column({ nullable: true })
  packId: string;

  @Column({ nullable: true })
  packName: string;

  @Column()
  ac: number;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.userPermissions)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
