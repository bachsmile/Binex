/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateWalletDto } from '~/types/payload/create-wallet';
import type { Wallet } from '~/types/response/wallet';
import type { DepositDto } from '~/types/payload/deposit';
import type { WalletActionResponse } from '~/types/response/wallet';
import type { TransferDto } from '~/types/payload/transfer';
import type { AdminWalletResponse } from '~/types/response/pay';

export const useWalletApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateWalletDto) => 
      api.call<ApiResponse<Wallet>, ApiError>('/wallet', 'POST', payload),

    findAll: () => 
      api.call<ApiListResponse<Wallet>, ApiError>('/wallet', 'GET'),

    findMine: () => 
      api.call<ApiListResponse<Wallet>, ApiError>('/wallet/mine', 'GET'),

    findAdminWallets: () => 
      api.call<ApiListResponse<Wallet>, ApiError>('/wallet/admin', 'GET'),

    deposit: (payload: DepositDto) => 
      api.call<ApiResponse<WalletActionResponse>, ApiError>('/wallet/deposit', 'POST', payload),

    transfer: (payload: TransferDto) => 
      api.call<ApiResponse<WalletActionResponse>, ApiError>('/wallet/transfer', 'POST', payload),

    createKey: () => 
      api.call<ApiResponse<any>, ApiError>('/wallet/create-key', 'GET'),

    validatePrivateKey: () => 
      api.call<ApiResponse<string>, ApiError>('/wallet/validate-private-key', 'GET'),

    getAdminWallet: () => 
      api.call<ApiResponse<AdminWalletResponse>, ApiError>('/wallet/admin-wallet', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<Wallet>, ApiError>(`/wallet/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<Wallet>, ApiError>(`/wallet/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wallet/${payload}`, 'DELETE'),

  };
};
