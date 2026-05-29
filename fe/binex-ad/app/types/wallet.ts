import type { User } from './user';

export interface Wallet {
  id: string;
  name: string;
  balance: Record<string, number>;
  userId: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  isDeleted?: boolean;
  isAdminWallet?: boolean;
  pin: string;
  address: string;
  privateKey: string;
  publicKey: string;
  user?: User;
}

export type WalletPayload = Partial<
  Pick<Wallet, 'name' | 'status' | 'pin' | 'privateKey' | 'publicKey' | 'balance' | 'userId'>
>;

export interface CreateWalletPayload {
  name: string;
  type?: string;
  privateKey: string;
  publicKey: string;
  pin: string;
  userId?: string;
}

export interface TransferWalletPayload {
  from?: string;
  to: string;
  amount: number;
  currency: 'VND' | 'USD';
}

export interface DepositWalletPayload {
  address: string;
  amount: number;
  currency: 'VND' | 'USD';
  methodPayId?: string;
  description?: string;
}
