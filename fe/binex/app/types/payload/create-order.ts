/** Auto-generated payload */
import type { PaymentStatus } from '../enums/order';

export interface CreateOrderDto {

  packageId?: string;

  serviceId?: string;

  amount: number;

  currency?: string;

  paymentStatus?: PaymentStatus;

  transactionId?: string;

  orderType?: string;

}

