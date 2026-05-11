/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateInvestmentDto } from '~/types/payload/create-investment';

export const useInvestmentApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateInvestmentDto) => 
      api.call<ApiResponse<any>, ApiError>('/finance/investment', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/finance/investment', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/investment/${payload}`, 'GET'),

    update: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/investment/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/investment/${payload}`, 'DELETE'),

  };
};
