/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateCurrencyDto } from '~/types/payload/create-currency';

export const useCurrencyApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateCurrencyDto) => 
      api.call<ApiResponse<any>, ApiError>('/finance/currency', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/finance/currency', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/currency/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/currency/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/currency/${payload}`, 'DELETE'),

  };
};
