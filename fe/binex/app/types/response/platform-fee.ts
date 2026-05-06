/** Auto-generated response */
import type { FeeType } from '../enums/platform-fee';

export interface PlatformFee {

  id: string;



  name: string; // Tên hiển thị

  description: string;

  type: 'enum',
  enum: FeeType,
  default: FeeType.PERCENTAGE,
  type: FeeType;


  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

}

