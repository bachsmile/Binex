/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateFinanceDto } from '~/types/payload/create-finance';

export const useFinanceApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateFinanceDto) => 
      api.call<ApiResponse<any>, ApiError>('/finance', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/finance', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/${payload}`, 'DELETE'),

  };
};
