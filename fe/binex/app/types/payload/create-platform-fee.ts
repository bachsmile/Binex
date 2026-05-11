/** Auto-generated payload */
import type { FeeType } from '../enums/platform-fee';

export interface CreatePlatformFeeDto {

  /**
   * example: PLATFORM_COMMISSION
   * Mã định danh duy nhất
   */
  code: string;

  /**
   * example: Phí nền tảng
   */
  name: string;

  /**
   * example: Phí chiết khấu 10% trên mỗi giao dịch
   */
  description?: string;

  type: FeeType;

  /**
   * example: 10
   * Giá trị phần trăm hoặc số tiền cố định
   */
  value: number;

  isActive?: boolean;

}

