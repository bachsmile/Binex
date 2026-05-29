import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';

export interface ServiceGroup {
  id: string;
  name: string;
  code?: string;
  description: string;
  priority: number;
  icon?: string;
  thumbnail?: string;
  packageIds?: string[];
  packages?: any[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  code?: string;
  description: string;
  priority: number;
  icon?: string;
  thumbnail?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useServiceApi = () => {
  const api = useApi();
  return {
    ...api,

    findAll: (payload?: { page?: number; limit?: number }) =>
      api.call<ApiListResponse<ServiceGroup>, ApiError>('/service-group', 'GET', payload),

    findAllServices: () =>
      api.call<ApiListResponse<Service>, ApiError>('/service', 'GET'),

    findOne: (id: string) =>
      api.call<ApiResponse<ServiceGroup>, ApiError>(`/service-group/${id}`, 'GET'),

    create: (payload: Partial<ServiceGroup>) =>
      api.call<ApiResponse<ServiceGroup>, ApiError>('/service-group', 'POST', payload),

    update: (id: string, payload: Partial<ServiceGroup>) =>
      api.call<ApiResponse<ServiceGroup>, ApiError>(`/service-group/${id}`, 'PATCH', payload),

    remove: (id: string) =>
      api.call<ApiResponse<ServiceGroup>, ApiError>(`/service-group/${id}`, 'DELETE'),
  };
};
