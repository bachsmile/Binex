/** Auto-generated payload */
import type { TransactionType, TransactionStatus } from '../enums/wallet';

export interface UpdateWalletDto {

}

export interface TransferDto {
  toAddress: string;
  amount: number;
  currency: string;
}

export interface DepositDto {
  address: string;
  amount: number;
  currency: string;
}

export interface CreateWalletDto {
  name: string;
  type: string;
  privateKey: string;
  publicKey: string;
  pin: string;
  userId: string;
}

export interface CreateTransactionDto {
  fromAddress?: string;
  toAddress?: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status?: TransactionStatus;
  description?: string;
  userId?: string;
}

