/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateUserDto } from '~/types/payload/create-user';

export const useUserApi = () => {
  const api = useApi();
  return {
    updatePermissions: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}/permissions`, 'PATCH'),

    extendPermission: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/permission/${payload}/extend`, 'PATCH'),

    changePackage: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/permission/${payload}/change-package`, 'PATCH'),

    getUserPermissions: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}/permissions`, 'GET'),

    create: (payload: CreateUserDto) => 
      api.call<ApiResponse<any>, ApiError>('/user', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/user', 'GET'),

    findPage: () => 
      api.call<ApiResponse<any>, ApiError>('/user/page', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}`, 'GET'),

    update: (id: string, payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${id}`, 'PATCH', payload),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}`, 'DELETE'),

    updateStorageLimit: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}/storage-limit`, 'PATCH'),

    updateRecordLimit: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}/record-limit`, 'PATCH'),

  };
};
