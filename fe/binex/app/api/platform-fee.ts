/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreatePlatformFeeDto } from '~/types/payload/create-platform-fee';

export const usePlatformFeeApi = () => {
  const api = useApi();
  return {
    create: (payload: CreatePlatformFeeDto) => 
      api.call<ApiResponse<any>, ApiError>('/platform-fee', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/platform-fee', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/platform-fee/${payload}`, 'GET'),

    update: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/platform-fee/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/platform-fee/${payload}`, 'DELETE'),

  };
};
