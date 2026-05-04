import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from '../../user/entities/user.entity';
import { WdWeb } from './wd-web.entity';
import { WdCard } from './wd-card.entity';

@Entity('wedding')
export class Wedding {
  @PrimaryColumn({ length: 255 })
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = ulid();
    }
  }

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // 🤵 Groom Information
  @Column()
  groomName: string;

  @Column({ nullable: true })
  groomPhone: string;

  @Column({ nullable: true })
  fatherGroomName: string;

  @Column({ nullable: true })
  motherGroomName: string;

  // 👰 Bride Information
  @Column()
  brideName: string;

  @Column({ nullable: true })
  bridePhone: string;

  @Column({ nullable: true })
  fatherBrideName: string;

  @Column({ nullable: true })
  motherBrideName: string;

  // 📅 Wedding Schedule
  @Column({ type: 'timestamp' })
  weddingDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  inviteDate: Date;

  @Column({ nullable: true })
  ceremonyTime: string;

  // 📍 Location
  @Column()
  venueName: string;

  @Column()
  venueAddress: string;

  @Column({ nullable: true })
  inviteAddress: string;

  // 👥 Management
  @Column({ nullable: true })
  userId: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ nullable: true })
  qrCode: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  budget: number;

  @Column({ default: 0 })
  guestCount: number;

  @Column({ nullable: true })
  expireDays: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @Column('text', { array: true, nullable: true })
  videos: string[];

  @Column({ nullable: true })
  webId: string;

  @Column({ nullable: true })
  cardId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.weddings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => WdWeb, (wdWeb) => wdWeb.wedding)
  @JoinColumn({ name: 'webId' })
  wdWeb: WdWeb;

  @OneToOne(() => WdCard, (wdCard) => wdCard.wedding)
  @JoinColumn({ name: 'cardId' })
  wdCard: WdCard;
}
