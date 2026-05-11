/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateWdCardDto } from '~/types/payload/create-wd-card';

export const useWdCardApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateWdCardDto) => 
      api.call<ApiResponse<any>, ApiError>('/wd-card', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/wd-card', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wd-card/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wd-card/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wd-card/${payload}`, 'DELETE'),

  };
};
