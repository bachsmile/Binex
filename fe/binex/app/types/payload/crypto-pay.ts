/** Auto-generated payload */


export interface CryptoPayDto {

  /**
   * example: 0x...
   * Địa chỉ ví người nhận (mặc định là ví Super Admin)
   */
  toAddress?: string;

  /**
   * example: 0.1
   * Số tiền thanh toán
   */
  amount: number;

  /**
   * example: ETH
   * Loại tiền (ETH
   */
  symbol: string;

  /**
   * example: invoice_123
   * Mã hóa đơn
   */
  orderId: string;

}

