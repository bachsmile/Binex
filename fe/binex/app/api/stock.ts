/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateStockDto } from '~/types/payload/create-stock';

export const useStockApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateStockDto) => 
      api.call<ApiResponse<any>, ApiError>('/finance/stock', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/finance/stock', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/stock/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/stock/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/stock/${payload}`, 'DELETE'),

  };
};
