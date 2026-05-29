import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { Wed } from '../../wed/entities/wed.entity';
import { WedParticipant } from '../../wed-participants/entities/wed-participant.entity';

@Entity('wed_map_table')
export class WedMapTable {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column()
  name: string; // Tên bàn (Ví dụ: Bàn 1, Bàn VIP, Bàn Bạn Cấp 3...)

  @Column()
  areaName: string; // Tên khu vực (Ví dụ: Sát sân khấu, Phía nhà trai, Phía nhà gái...)

  @Column({ type: 'integer', default: 10 })
  maxSeats: number; // Số ghế tối đa của bàn

  @Column({ type: 'integer', default: 0 })
  currentSeats: number; // Số ghế đã được đăng ký/ngồi

  @Column({ default: 'available' })
  status: string; // Trạng thái bàn (available, full)

  @Column({ type: 'text', nullable: true })
  note: string | null; // Ghi chú bàn

  @Column({ type: 'char', length: 26 })
  wedId: string; // ID đám cưới liên kết

  @ManyToOne(() => Wed)
  @JoinColumn({ name: 'wedId' })
  wed: Wed;

  @OneToMany(() => WedParticipant, (participant) => participant.table)
  participants: WedParticipant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
