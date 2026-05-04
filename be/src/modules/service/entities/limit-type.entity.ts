import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('limit_type')
export class LimitType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string; // Key dùng trong object recordLimit (ví dụ: 'wedding_count')

  @Column()
  name: string; // Tên hiển thị (ví dụ: 'Số lượng đám cưới tối đa')

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  unit: string; // Đơn vị tính (ví dụ: 'Bản ghi', 'Người')

  @CreateDateColumn()
  createdAt: Date;
}
