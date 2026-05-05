/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreatePlatformFeeDto } from '~/types/payload/platform-fee';

export const usePlatform-feeApi = () => {
  const api = useApi();
  return {
    create: (payload: CreatePlatformFeeDto) => 
      api.call<any, ApiError>('/platform-fee', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/platform-fee', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/platform-fee/:id', 'GET'),

    update: () => 
      api.call<any, ApiError>('/platform-fee/:id', 'PATCH'),

    remove: () => 
      api.call<any, ApiError>('/platform-fee/:id', 'DELETE'),

  };
};
