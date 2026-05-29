import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { Transaction } from '~/types/transaction';

export const useTransactionApi = () => {
  const api = useApi();
  return {
    ...api,

    findAll: (params?: { page?: number; limit?: number }) =>
      api.call<ApiResponse<Transaction[]> | ApiListResponse<Transaction>, ApiError>('/transaction', 'GET', params),

    findMine: (params?: { id?: string; userId?: string; page?: number; limit?: number }) =>
      api.call<ApiResponse<Transaction[]> | ApiListResponse<Transaction>, ApiError>('/transaction/mine', 'GET', params),

    findOne: (id: string) =>
      api.call<ApiResponse<Transaction>, ApiError>(`/transaction/${id}`, 'GET'),
  };
};
