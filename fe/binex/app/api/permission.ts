/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreatePermissionDto } from '~/types/payload/create-permission';

export const usePermissionApi = () => {
  const api = useApi();
  return {
    create: (payload: CreatePermissionDto) => 
      api.call<ApiResponse<any>, ApiError>('/permission', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/permission', 'GET'),

    findByPackId: () => 
      api.call<ApiResponse<any>, ApiError>('/permission/by-pack', 'GET'),

    findByServiceId: () => 
      api.call<ApiResponse<any>, ApiError>('/permission/by-service', 'GET'),

    findOne: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/permission/${payload}`, 'GET'),

    update: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/permission/${payload}`, 'PATCH'),

    remove: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/permission/${payload}`, 'DELETE'),

    removeByPackId: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/permission/by-pack/${payload}`, 'DELETE'),

    bulkSet: () => 
      api.call<ApiResponse<any>, ApiError>('/permission/bulk-set', 'POST'),

  };
};
