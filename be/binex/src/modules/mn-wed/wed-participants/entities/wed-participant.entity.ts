import { ulid } from 'ulid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wed } from '../../wed/entities/wed.entity';
import { ParticipantSide, ParticipantStatus } from '../enum/participant.enum';
import { WedMapTable } from '../../wed-map-table/entities/wed-map-table.entity';

@Entity('wed_participants')
export class WedParticipant {
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

  @Column({ type: 'varchar', nullable: true })
  phone: string | null; // Số điện thoại

  @Column({ type: 'varchar', nullable: true })
  email: string | null; // Địa chỉ email

  @Column({
    type: 'enum',
    enum: ParticipantSide,
    default: ParticipantSide.GROOM,
  })
  side: ParticipantSide; // Thuộc phía nhà trai hay nhà gái

  @Column({
    type: 'enum',
    enum: ParticipantStatus,
    default: ParticipantStatus.PENDING,
  })
  status: ParticipantStatus; // Trạng thái xác nhận tham gia

  @Column({ type: 'varchar', nullable: true })
  address: string | null; // Địa chỉ của khách

  @Column({ type: 'text', nullable: true })
  note: string | null; // Ghi chú (ví dụ: ăn chay, dị ứng)

  @Column({ type: 'varchar', nullable: true })
  tableNumber: string | null; // Số bàn sắp xếp

  @Column({ default: 1 })
  adultCount: number; // Số người lớn tham gia

  @Column({ default: 0 })
  childrenCount: number; // Số trẻ em tham gia

  @Column({ type: 'varchar', nullable: true })
  token: string | null; // Token dùng cho link xác nhận tham gia cá nhân

  @Column({ type: 'char', length: 26 })
  wedId: string; // ID của đám cưới liên kết

  @Column({ default: false })
  isCardSent: boolean; // Trạng thái đã gửi thiệp hay chưa

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  giftMoney: number; // Tiền mừng cưới

  @Column({ type: 'char', length: 26, nullable: true })
  tableId: string | null;

  @ManyToOne(() => WedMapTable, (table) => table.participants)
  @JoinColumn({ name: 'tableId' })
  table: WedMapTable | null;

  @ManyToOne(() => Wed, (wedding) => wedding.participants)
  @JoinColumn({ name: 'wedId' })
  wed: Wed;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
