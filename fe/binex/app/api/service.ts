/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreatePackageDto } from '~/types/payload/service';

export const useServiceApi = () => {
  const api = useApi();
  return {
    updateRecordLimit: () => 
      api.call<any, ApiError>(`/package/${payload}/record-limit`, 'PATCH'),

    create: (payload: CreatePackageDto) => 
      api.call<any, ApiError>('/package', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/package', 'GET'),

    findOne: (payload: string) => 
      api.call<any, ApiError>(`/package/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<any, ApiError>(`/package/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<any, ApiError>(`/package/${payload}`, 'DELETE'),

    removeAll: () => 
      api.call<any, ApiError>('/package', 'DELETE'),

  };
};
