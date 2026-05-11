/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateNewsDto } from '~/types/payload/create-news';
import type { GetNewsQueryDto } from '~/types/payload/get-news-query';

export const useNewsApi = () => {
  const api = useApi();
  return {
    getCategories: () => 
      api.call<ApiResponse<any>, ApiError>('/news/categories', 'GET'),

    create: (payload: CreateNewsDto) => 
      api.call<ApiResponse<any>, ApiError>('/news', 'POST', payload),

    findAll: (payload: GetNewsQueryDto) => 
      api.call<ApiResponse<any>, ApiError>('/news', 'GET', payload),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/news/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/news/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/news/${payload}`, 'DELETE'),

  };
};
