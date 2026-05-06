/** Auto-generated payload */
import type { OrderType, MethodPayType } from '../enums/pay';

export interface ManualPayDto {

  example: 'PK_001',
  description: 'ID của gói',
  required: false,
  packageId?: string;

  example: 'SER_001',
  description: 'ID của dịch vụ',
  required: false,
  serviceId?: string;

  orderType: OrderType;

  amount: number;

  example: 'TX123456789',
  description: 'Mã giao dịch ngân hàng',
  transactionCode: string;

  example: 'https
  description: 'URL ảnh minh chứng thanh toán',
  proofImage?: string;

  example: '01J...',
  description: 'ID của phương thức thanh toán đã chọn',
  methodPayId: string;

}

export interface CryptoPayDto {

  example: '0x...',
  required: false,
  toAddress?: string;

  amount: number;

  symbol: string;

  orderId: string;

}

export interface UpdateMethodPayDto extends Partial<CreateMethodPayDto> {

}

export interface CreateMethodPayDto {

  name: string;

  bankNumber: string;

  cardNumber?: string;

  accountHolderName: string;

  bankName: string;

  QRCode?: string;

  code: string;

  type: MethodPayType;

  status?: string;

}

