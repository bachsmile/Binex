/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateUserDto } from '~/types/payload/create-user';

export const useUserApi = () => {
  const api = useApi();
  return {
    updateSubscriptions: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}/subscriptions`, 'PATCH'),

    extendSubscription: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/subscription/${payload}/extend`, 'PATCH'),

    changePackage: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/subscription/${payload}/change-package`, 'PATCH'),

    getUserSubscriptions: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}/subscriptions`, 'GET'),

    clearAllExceptUsers: () => 
      api.call<ApiResponse<any>, ApiError>('/user/clear-except-users', 'POST'),

    create: (payload: CreateUserDto) => 
      api.call<ApiResponse<any>, ApiError>('/user', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/user', 'GET'),

    findPage: () => 
      api.call<ApiResponse<any>, ApiError>('/user/page', 'GET'),

    findMine: () => 
      api.call<ApiResponse<any>, ApiError>('/user/mine', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}`, 'DELETE'),

    updateStorageLimit: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}/storage-limit`, 'PATCH'),

    updateRecordLimit: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/user/${payload}/record-limit`, 'PATCH'),

  };
};
