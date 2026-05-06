/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreatePlatformFeeDto } from '~/types/payload/platform-fee';

export const usePlatformFeeApi = () => {
  const api = useApi();
  return {
    create: (payload: CreatePlatformFeeDto) => 
      api.call<any, ApiError>('/platform-fee', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/platform-fee', 'GET'),

    findOne: (payload: string) => 
      api.call<any, ApiError>(`/platform-fee/${payload}`, 'GET'),

    update: () => 
      api.call<any, ApiError>(`/platform-fee/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<any, ApiError>(`/platform-fee/${payload}`, 'DELETE'),

  };
};
