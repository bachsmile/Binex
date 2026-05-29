/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';


export const useTransactionApi = () => {
  const api = useApi();
  return {
    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/transaction', 'GET'),

    findMine: () => 
      api.call<ApiResponse<any>, ApiError>('/transaction/mine', 'GET'),

    findByAddress: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/transaction/address/${payload}`, 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/transaction/${payload}`, 'GET'),

  };
};
