/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateUserDto } from '~/types/payload/user';
import type { UpdateUserDto } from '~/types/payload/user';

export const useUserApi = () => {
  const api = useApi();
  return {
    updatePermissions: () => 
      api.call<any, ApiError>('/user/:id/permissions', 'PATCH'),

    n: () => 
      api.call<any, ApiError>('/user/permission/:id/extend', 'PATCH'),

    n: () => 
      api.call<any, ApiError>('/user/permission/:id/change-package', 'PATCH'),

    getUserPermissions: () => 
      api.call<any, ApiError>('/user/:userId/permissions', 'GET'),

    create: (payload: CreateUserDto) => 
      api.call<any, ApiError>('/user', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/user', 'GET'),

    findPage: () => 
      api.call<any, ApiError>('/user/page', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/user/:id', 'GET'),

    update: (payload: UpdateUserDto) => 
      api.call<any, ApiError>('/user/:id', 'PATCH', payload),

    remove: () => 
      api.call<any, ApiError>('/user/:id', 'DELETE'),

    updateStorageLimit: () => 
      api.call<any, ApiError>('/user/:id/storage-limit', 'PATCH'),

    updateRecordLimit: () => 
      api.call<any, ApiError>('/user/:id/record-limit', 'PATCH'),

  };
};
