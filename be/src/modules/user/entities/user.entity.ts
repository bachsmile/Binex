import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { ulid } from 'ulid';
import { Role } from '../../auth/enums/role.enum';
import { Wedding } from '../../wedding/entities/wedding.entity';
import { WdWeb } from '../../wedding/entities/wd-web.entity';
import { WdCard } from '../../wedding/entities/wd-card.entity';
import { UserSubscription } from './user-subscription.entity';
import { MethodPay } from '../../pay/entities/method-pay.entity';

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

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
  code: string;

  @Column('text', { array: true, nullable: true })
  serviceIds: string[];

  @Column({ nullable: true })
  invoiceCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  country: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  usedStorage: number; // Tổng dung lượng đã dùng (MB)

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  storageLimit: number; // Giới hạn dung lượng riêng (MB), 0 là dùng theo gói

  @Column({ type: 'json', default: {} })
  recordLimit: any; // Giới hạn bản ghi riêng { "key": limit }

  @Column({ nullable: true })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  deletedBy: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  //Các quản lý của user
  @Column('text', { array: true, nullable: true })
  managerIds: string[];

  @OneToMany(() => Wedding, (wedding) => wedding.user)
  weddings: Wedding[];

  @OneToMany(() => WdWeb, (wdWeb) => wdWeb.user)
  wdWebs: WdWeb[];

  @OneToMany(() => WdCard, (wdCard) => wdCard.user)
  wdCards: WdCard[];

  @OneToMany(() => UserSubscription, (userSubscription) => userSubscription.user)
  userSubscriptions: UserSubscription[];

  @OneToMany(() => MethodPay, (methodPay) => methodPay.user)
  methodPays: MethodPay[];
}
