/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateServiceDto } from '~/types/payload/create-service';
import type { Service } from '~/types/response/service';

export const useServiceApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateServiceDto) => 
      api.call<ApiResponse<Service>, ApiError>('/service', 'POST', payload),

    findAll: () => 
      api.call<ApiListResponse<Service>, ApiError>('/service', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<Service>, ApiError>(`/service/${payload}`, 'GET'),

    findByUserId: (payload: string) => 
      api.call<ApiResponse<string>, ApiError>(`/service/user/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<Service>, ApiError>(`/service/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<Service>, ApiError>(`/service/${payload}`, 'DELETE'),

    findWithPriority: (payload: string) => 
      api.call<ApiResponse<Service[]>, ApiError>(`/service/priority/${payload}`, 'GET'),

  };
};
