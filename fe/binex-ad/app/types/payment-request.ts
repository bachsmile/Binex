import type { MethodPay } from './method-pay';

export enum PaymentRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum OrderType {
  CR_AC_ADMIN = 'CR_AC_ADMIN',
  RN_AC_PK = 'RN_AC_PK',
  CR_OD_PK = 'CR_OD_PK',
  OTHER = 'OTHER',
}

export interface PaymentRequest {
  id: string;
  packageId?: string;
  serviceId?: string;
  orderType: OrderType;
  userId?: string;
  methodPayId: string;
  methodPay?: MethodPay;
  amount: number;
  transactionCode: string;
  proofImage?: string;
  status: PaymentRequestStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}
