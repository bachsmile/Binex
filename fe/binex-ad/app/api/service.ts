import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  priority: number;
  icon?: string;
  thumbnail?: string;
  packageIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const useServiceApi = () => {
  const api = useApi();
  return {
    ...api,

    findAll: (payload?: { page?: number; limit?: number }) => 
      api.call<ApiListResponse<ServiceItem>, ApiError>('/service', 'GET', payload),

    findOne: (id: string) =>
      api.call<ApiResponse<ServiceItem>, ApiError>(`/service/${id}`, 'GET'),

    create: (payload: Partial<ServiceItem>) => 
      api.call<ApiResponse<ServiceItem>, ApiError>('/service', 'POST', payload),

    update: (id: string, payload: Partial<ServiceItem>) => 
      api.call<ApiResponse<ServiceItem>, ApiError>(`/service/${id}`, 'PATCH', payload),

    remove: (id: string) => 
      api.call<ApiResponse<ServiceItem>, ApiError>(`/service/${id}`, 'DELETE'),
  };
};
