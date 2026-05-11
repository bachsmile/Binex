/** Auto-generated payload */
import type { OrderType } from '../enums/order-type';

export interface ManualPayDto {

  /**
   * example: PK_001
   * ID của gói
   */
  packageId?: string;

  /**
   * example: SER_001
   * ID của dịch vụ
   */
  serviceId?: string;

  /**
   * Loại đơn hàng
   */
  orderType: OrderType;

  /**
   * example: 100000
   * Số tiền đã chuyển
   */
  amount: number;

  /**
   * example: TX123456789
   * Mã giao dịch ngân hàng
   */
  transactionCode: string;

  /**
   * example: https://...
   * URL ảnh minh chứng thanh toán
   */
  proofImage?: string;

  /**
   * example: 01J...
   * ID của phương thức thanh toán đã chọn
   */
  methodPayId: string;

}

