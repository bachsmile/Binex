/** Auto-generated response */
import type { TransactionType, TransactionStatus } from '../enums/wallet';

export interface Wallet {
  id: string;
  name: string;
  balance: Record<string, number>;
  userId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deletedBy: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
  pin: string;
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface Transaction {
  id: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

