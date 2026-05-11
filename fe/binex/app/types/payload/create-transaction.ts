/** Auto-generated payload */
import type { TransactionType, TransactionStatus } from '../enums/transaction';

export interface CreateTransactionDto {

  /**
   * example: 0xB...
   */
  fromAddress?: string;

  /**
   * example: 0xB...
   */
  toAddress?: string;

  /**
   * example: 100
   */
  amount: number;

  /**
   * example: VND
   */
  currency: string;

  type: TransactionType;

  status?: TransactionStatus;

  /**
   * example: Chuyển tiền cho bạn
   */
  description?: string;

  userId?: string;

}

