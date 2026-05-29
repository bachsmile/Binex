import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ulid } from 'ulid';
import { User } from 'src/modules/mn-user/user/entities/user.entity';
import { WedWeb } from '../../wed-web/entities/wed-web.entity';
import { WedCard } from '../../wed-card/entities/wed-card.entity';
import { WedParticipant } from '../../wed-participants/entities/wed-participant.entity';

@Entity('wed')
export class Wed {
  @PrimaryColumn({ type: 'char', length: 26 })
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
  @Column({ type: 'char', length: 26, nullable: true })
  userId: string | null;

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

  @Column({ type: 'char', length: 26, nullable: true })
  webId: string | null;

  @Column({ type: 'char', length: 26, nullable: true })
  cardId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => WedWeb)
  @JoinColumn({ name: 'webId' })
  web: WedWeb;

  @OneToOne(() => WedCard)
  @JoinColumn({ name: 'cardId' })
  card: WedCard;

  @OneToMany(() => WedParticipant, (part) => part.wed)
  participants: WedParticipant[];
}
