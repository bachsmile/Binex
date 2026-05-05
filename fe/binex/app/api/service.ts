/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreatePackageDto } from '~/types/payload/service';
import type { UpdatePackageDto } from '~/types/payload/service';

export const useServiceApi = () => {
  const api = useApi();
  return {
    updateRecordLimit: () => 
      api.call<any, ApiError>('/package/:id/record-limit', 'PATCH'),

    create: (payload: CreatePackageDto) => 
      api.call<any, ApiError>('/package', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/package', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/package/:id', 'GET'),

    update: (payload: UpdatePackageDto) => 
      api.call<any, ApiError>('/package/:id', 'PATCH', payload),

    remove: () => 
      api.call<any, ApiError>('/package/:id', 'DELETE'),

    removeAll: () => 
      api.call<any, ApiError>('/package', 'DELETE'),

  };
};
