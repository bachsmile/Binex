/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateMethodPayDto } from '~/types/payload/create-method-pay';

export const useMethodPayApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateMethodPayDto) => 
      api.call<ApiResponse<any>, ApiError>('/method-pay', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/method-pay', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/method-pay/${payload}`, 'GET'),

    update: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/method-pay/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/method-pay/${payload}`, 'DELETE'),

  };
};
