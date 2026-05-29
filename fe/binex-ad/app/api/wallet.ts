import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateWalletPayload, DepositWalletPayload, TransferWalletPayload, Wallet, WalletPayload } from '~/types/wallet';

export const useWalletApi = () => {
  const api = useApi();
  return {
    ...api,

    findMine: (params?: { id?: string; userId?: string; page?: number; limit?: number }) =>
      api.call<ApiListResponse<Wallet>, ApiError>('/wallet/mine', 'GET', params),

    findAdmin: (params?: { page?: number; limit?: number }) =>
      api.call<ApiListResponse<Wallet>, ApiError>('/wallet/admin', 'GET', params),

    findAll: (params?: { page?: number; limit?: number }) =>
      api.call<ApiListResponse<Wallet>, ApiError>('/wallet', 'GET', params),

    create: (payload: CreateWalletPayload) =>
      api.call<ApiResponse<Wallet>, ApiError>('/wallet', 'POST', payload),

    transfer: (payload: TransferWalletPayload) =>
      api.call<ApiResponse<any>, ApiError>('/wallet/transfer', 'POST', payload),

    deposit: (payload: DepositWalletPayload) =>
      api.call<ApiResponse<any>, ApiError>('/wallet/deposit', 'POST', payload),

    createKey: () =>
      api.call<ApiResponse<{ privateKey: string }>, ApiError>('/wallet/create-key', 'GET'),

    validatePrivateKey: (privateKey: string) =>
      api.call<ApiResponse<string>, ApiError>('/wallet/validate-private-key', 'GET', { privateKey }),

    findOne: (id: string) =>
      api.call<ApiResponse<Wallet>, ApiError>(`/wallet/${id}`, 'GET'),

    update: (id: string, payload: WalletPayload) =>
      api.call<ApiResponse<Wallet>, ApiError>(`/wallet/${id}`, 'PATCH', payload),

    remove: (id: string) =>
      api.call<ApiResponse<any>, ApiError>(`/wallet/${id}`, 'DELETE'),
  };
};
