/** Auto-generated response */
import type { OrderType } from '../enums/order-type';
import type { PaymentRequestStatus } from '../enums/payment-request';
import type { MethodPay } from './method-pay';

export interface PaymentRequest {

  id: string;


  packageId?: string;

  serviceId?: string;

  orderType: OrderType;

  userId?: string;

  methodPayId: string;

  methodPay: MethodPay;

  amount: number;

  transactionCode: string;

  proofImage?: string;

  status: PaymentRequestStatus;

  adminNote?: string;

  createdAt: Date;

  updatedAt: Date;

}

