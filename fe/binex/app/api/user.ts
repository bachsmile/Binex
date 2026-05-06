/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateUserDto } from '~/types/payload/user';

export const useUserApi = () => {
  const api = useApi();
  return {
    updatePermissions: () => 
      api.call<any, ApiError>(`/user/${payload}/permissions`, 'PATCH'),

    n: () => 
      api.call<any, ApiError>(`/user/permission/${payload}/extend`, 'PATCH'),

    n: () => 
      api.call<any, ApiError>(`/user/permission/${payload}/change-package`, 'PATCH'),

    getUserPermissions: (payload: string) => 
      api.call<any, ApiError>(`/user/${payload}/permissions`, 'GET'),

    create: (payload: CreateUserDto) => 
      api.call<any, ApiError>('/user', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/user', 'GET'),

    findPage: () => 
      api.call<any, ApiError>('/user/page', 'GET'),

    findOne: (payload: string) => 
      api.call<any, ApiError>(`/user/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<any, ApiError>(`/user/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<any, ApiError>(`/user/${payload}`, 'DELETE'),

    updateStorageLimit: () => 
      api.call<any, ApiError>(`/user/${payload}/storage-limit`, 'PATCH'),

    updateRecordLimit: () => 
      api.call<any, ApiError>(`/user/${payload}/record-limit`, 'PATCH'),

  };
};
