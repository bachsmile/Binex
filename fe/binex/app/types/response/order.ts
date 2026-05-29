/** Auto-generated response */
import type { User } from './user';
import type { PaymentStatus } from '../enums/order';

export interface Order {

  id: string;

  userId: string;

  packageId: string;

  serviceGroupId: string;

  amount: number;

  currency: string;

  paymentStatus: PaymentStatus;

  transactionId: string;

  orderType: string;

  createdAt: Date;

  updatedAt: Date;

  user: User;

}

