import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ulid } from 'ulid';
import { Role } from '../../enum/role.enum';
import { UserStatus } from '../../enum/status.enum';
import { Banking } from 'src/modules/mn-wallet/banking/entities/banking.entity';
import { Wallet } from 'src/modules/mn-wallet/wallet/entities/wallet.entity';
import { UserMicro } from './user-micro.entity';

@Entity('user')
export class User {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ unique: true, nullable: true, type: 'char', length: 8 })
  reffer: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'varchar', nullable: true })
  twoFactorSecret: string | null;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Banking, (banking) => banking.user)
  bankings: Banking[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => UserMicro, (userMicro) => userMicro.user)
  userMicros: UserMicro[];

  @Column({ nullable: true })
  createdBy: string;

  @Column('text', { array: true, nullable: true })
  managerIds: string[];
}
