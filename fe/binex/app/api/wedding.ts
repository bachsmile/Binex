/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateWeddingDto } from '~/types/payload/create-wedding';

export const useWeddingApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateWeddingDto) => 
      api.call<ApiResponse<any>, ApiError>('/wedding', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/wedding', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding/${payload}`, 'DELETE'),

  };
};
