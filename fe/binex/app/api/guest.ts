/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateGuestDto } from '~/types/payload/create-guest';

export const useGuestApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateGuestDto) => 
      api.call<ApiResponse<any>, ApiError>('/wedding-guest', 'POST', payload),

    importGuests: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding-guest/import/${payload}`, 'POST'),

    downloadTemplate: () => 
      api.call<ApiResponse<any>, ApiError>('/wedding-guest/template', 'GET'),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/wedding-guest', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding-guest/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding-guest/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding-guest/${payload}`, 'DELETE'),

  };
};
