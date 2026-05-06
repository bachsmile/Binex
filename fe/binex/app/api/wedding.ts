/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateWdCardDto } from '~/types/payload/wedding';

export const useWeddingApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateWdCardDto) => 
      api.call<any, ApiError>('/wd-card', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/wd-card', 'GET'),

    findOne: (payload: string) => 
      api.call<any, ApiError>(`/wd-card/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<any, ApiError>(`/wd-card/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<any, ApiError>(`/wd-card/${payload}`, 'DELETE'),

  };
};
