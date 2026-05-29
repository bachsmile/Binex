/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateServiceGroupDto } from '~/types/payload/create-service-group';
import type { ServiceGroup } from '~/types/response/service-group';

export const useServiceGroupApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateServiceGroupDto) => 
      api.call<ApiResponse<ServiceGroup>, ApiError>('/service-group', 'POST', payload),

    findAll: () => 
      api.call<ApiListResponse<ServiceGroup>, ApiError>('/service-group', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<ServiceGroup>, ApiError>(`/service-group/${payload}`, 'GET'),

    findByUserId: (payload: string) => 
      api.call<ApiResponse<string>, ApiError>(`/service-group/user/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<ServiceGroup>, ApiError>(`/service-group/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<ServiceGroup>, ApiError>(`/service-group/${payload}`, 'DELETE'),

    findWithPriority: (payload: string) => 
      api.call<ApiResponse<ServiceGroup[]>, ApiError>(`/service-group/priority/${payload}`, 'GET'),

  };
};
