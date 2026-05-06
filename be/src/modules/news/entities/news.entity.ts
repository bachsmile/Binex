import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NewsCategory } from '../enums/news-category.enum';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Tiêu đề bài viết */
  @Column()
  title: string;

  /** Tóm tắt ngắn gọn nội dung bài viết */
  @Column({ type: 'text', nullable: true })
  summary: string;

  /** Nội dung chi tiết bài viết (Hỗ trợ HTML) */
  @Column({ type: 'text' })
  content: string;

  /** Phân loại tin tức */
  @Column({
    type: 'enum',
    enum: NewsCategory,
    default: NewsCategory.EVENT,
  })
  category: NewsCategory;

  /** URL ảnh đại diện cho bài viết */
  @Column({ nullable: true })
  image: string;

  /** Tên tác giả bài viết */
  @Column({ nullable: true })
  author: string;

  /** Đánh dấu bài viết nổi bật (Hiển thị ở vị trí ưu tiên) */
  @Column({ default: false })
  isFeatured: boolean;

  /** Đánh dấu đây là bài viết quảng cáo */
  @Column({ default: false })
  isAd: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
