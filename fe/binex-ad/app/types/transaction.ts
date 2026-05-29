export type TransactionType = 'transfer' | 'deposit' | 'withdraw';
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
  id: string;
  fromAddress?: string | null;
  toAddress?: string | null;
  amount: number | string;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description?: string | null;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}
