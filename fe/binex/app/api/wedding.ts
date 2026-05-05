/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateWdCardDto } from '~/types/payload/wedding';
import type { UpdateWdCardDto } from '~/types/payload/wedding';

export const useWeddingApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateWdCardDto) => 
      api.call<any, ApiError>('/wd-card', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/wd-card', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/wd-card/:id', 'GET'),

    update: (payload: UpdateWdCardDto) => 
      api.call<any, ApiError>('/wd-card/:id', 'PATCH', payload),

    remove: () => 
      api.call<any, ApiError>('/wd-card/:id', 'DELETE'),

  };
};
