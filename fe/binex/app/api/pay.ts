/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateMethodPayDto } from '~/types/payload/pay';

export const usePayApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateMethodPayDto) => 
      api.call<any, ApiError>('/method-pay', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/method-pay', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/method-pay/:id', 'GET'),

    update: () => 
      api.call<any, ApiError>('/method-pay/:id', 'PATCH'),

    remove: () => 
      api.call<any, ApiError>('/method-pay/:id', 'DELETE'),

  };
};
