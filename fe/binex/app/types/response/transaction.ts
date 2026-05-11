/** Auto-generated response */
import type { TransactionType, TransactionStatus } from '../enums/transaction';

export interface Transaction {

  id: string;


  fromAddress: string;

  toAddress: string;

  amount: number;

  currency: string;

  type: TransactionType;

  status: TransactionStatus;

  description: string;

  userId: string; // The user who owns this transaction record (sender or receiver);

  createdAt: Date;

  updatedAt: Date;

}

