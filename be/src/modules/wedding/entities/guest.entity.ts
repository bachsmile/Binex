import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Wedding } from './wedding.entity';

export enum GuestStatus {
  PENDING = 'pending', // Chưa gửi/Chờ xác nhận
  CONFIRMED = 'confirmed', // Đã xác nhận tham gia
  DECLINED = 'declined', // Đã từ chối
}

export enum GuestSide {
  GROOM = 'groom', // Nhà trai
  BRIDE = 'bride', // Nhà gái
}

@Entity('guest')
export class Guest {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column()
  fullName: string; // Họ tên khách mời

  @Column({ nullable: true })
  phone: string; // Số điện thoại

  @Column({ nullable: true })
  email: string; // Địa chỉ email

  @Column({
    type: 'enum',
    enum: GuestSide,
    default: GuestSide.GROOM,
  })
  side: GuestSide; // Thuộc phía nhà trai hay nhà gái

  @Column({
    type: 'enum',
    enum: GuestStatus,
    default: GuestStatus.PENDING,
  })
  status: GuestStatus; // Trạng thái xác nhận tham gia

  @Column({ nullable: true })
  address: string; // Địa chỉ của khách

  @Column({ nullable: true })
  note: string; // Ghi chú (ví dụ: ăn chay, dị ứng)

  @Column({ nullable: true })
  tableNumber: string; // Số bàn sắp xếp

  @Column({ default: 1 })
  adultCount: number; // Số người lớn tham gia

  @Column({ default: 0 })
  childrenCount: number; // Số trẻ em tham gia

  @Column({ nullable: true })
  token: string; // Token dùng cho link xác nhận tham gia cá nhân

  @Column()
  weddingId: string; // ID của đám cưới liên kết

  @ManyToOne(() => Wedding, (wedding) => wedding.guests)
  @JoinColumn({ name: 'weddingId' })
  wedding: Wedding;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
