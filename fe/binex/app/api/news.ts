/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateNewsDto } from '~/types/payload/news';
import type { GetNewsQueryDto } from '~/types/payload/news';

export const useNewsApi = () => {
  const api = useApi();
  return {
    getCategories: () => 
      api.call<any, ApiError>('/news/categories', 'GET'),

    create: (payload: CreateNewsDto) => 
      api.call<any, ApiError>('/news', 'POST', payload),

    findAll: (payload: GetNewsQueryDto) => 
      api.call<any, ApiError>('/news', 'GET', payload),

    findOne: (payload: string) => 
      api.call<any, ApiError>(`/news/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<any, ApiError>(`/news/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<any, ApiError>(`/news/${payload}`, 'DELETE'),

  };
};
