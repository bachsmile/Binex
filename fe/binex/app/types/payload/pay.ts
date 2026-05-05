/** Auto-generated payload */
import type { OrderType, MethodPayType } from '../enums/pay';

export interface ManualPayDto {
  packageId?: string;
  serviceId?: string;
  orderType: OrderType;
  amount: number;
  transactionCode: string;
  proofImage?: string;
  methodPayId: string;
}

export interface CryptoPayDto {
  required: false,
  toAddress?: string;
  amount: number;
  symbol: string;
  orderId: string;
}

export interface UpdateMethodPayDto {

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

