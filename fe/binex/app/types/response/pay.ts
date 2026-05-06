/** Auto-generated response */
import type { OrderType, PaymentRequestStatus, MethodPayType } from '../enums/pay';

export interface PaymentRequest {

  id: string;


  packageId?: string;

  serviceId?: string;

  type: 'enum',
  enum: OrderType,
  default: OrderType.OTHER,
  orderType: OrderType;

  userId?: string;

  methodPayId: string;

  methodPay: MethodPay;

  amount: number;

  transactionCode: string;

  proofImage?: string;

  type: 'enum',
  enum: PaymentRequestStatus,
  default: PaymentRequestStatus.PENDING,
  status: PaymentRequestStatus;

  adminNote?: string;

  createdAt: Date;

  updatedAt: Date;

}

export interface Pay {

}

export interface MethodPay {

  id: string;


  name: string;

  bankNumber: string;

  cardNumber: string;

  accountHolderName: string;

  bankName: string;

  QRCode: string;

  code: string;

  type: 'enum',
  enum: MethodPayType,
  default: MethodPayType.ACCOUNT_NUMBER,
  type: MethodPayType;

  status: string;

}

