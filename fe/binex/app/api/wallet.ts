/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateWalletDto } from '~/types/payload/create-wallet';
import type { DepositDto } from '~/types/payload/deposit';
import type { TransferDto } from '~/types/payload/transfer';

export const useWalletApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateWalletDto) => 
      api.call<ApiResponse<any>, ApiError>('/wallet', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/wallet', 'GET'),

    deposit: (payload: DepositDto) => 
      api.call<ApiResponse<any>, ApiError>('/wallet/deposit', 'POST', payload),

    transfer: (payload: TransferDto) => 
      api.call<ApiResponse<any>, ApiError>('/wallet/transfer', 'POST', payload),

    createKey: () => 
      api.call<ApiResponse<any>, ApiError>('/wallet/create-key', 'GET'),

    validatePrivateKey: (privateKey: string) => 
      api.call<ApiResponse<any>, ApiError>('/wallet/validate-private-key', 'GET', { privateKey }),
    
    getTransactionCode: () => 
      api.call<ApiResponse<any>, ApiError>('/wallet/transaction-code', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wallet/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wallet/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wallet/${payload}`, 'DELETE'),

  };
};
