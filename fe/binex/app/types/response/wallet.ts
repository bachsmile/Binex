/** Auto-generated response */
import type { User } from './user';

export interface WalletResponse {

  data: Wallet;

}

export interface WalletListResponse {

  data: Wallet[];

  total: number;

}

export interface WalletActionResponse {

  success: boolean;

  message?: string;

  transactionId?: string;

  data?: Wallet;

}

export interface AdminWalletResponse {

  address: string;

}

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

  isAdminWallet: boolean;

  pin: string;

  address: string;

  privateKey: string;

  publicKey: string;

  user: User;

}

