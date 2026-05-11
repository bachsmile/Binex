/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateLimitTypeDto } from '~/types/payload/create-limit-type';

export const useLimitTypeApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateLimitTypeDto) => 
      api.call<ApiResponse<any>, ApiError>('/limit-type', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/limit-type', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/limit-type/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/limit-type/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/limit-type/${payload}`, 'DELETE'),

  };
};
