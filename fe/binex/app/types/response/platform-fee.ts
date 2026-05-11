/** Auto-generated response */
import type { FeeType } from '../enums/platform-fee';

export interface PlatformFee {

  id: string;


  code: string; // Mã định danh (ví dụ;

  name: string; // Tên hiển thị;

  description: string;

  type: FeeType;

  value: number; // Giá trị (ví dụ;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

}

