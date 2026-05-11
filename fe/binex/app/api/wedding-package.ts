/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateWeddingPackageDto } from '~/types/payload/create-wedding-package';

export const useWeddingPackageApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateWeddingPackageDto) => 
      api.call<ApiResponse<any>, ApiError>('/wedding-package', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/wedding-package', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding-package/${payload}`, 'GET'),

    update: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding-package/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/wedding-package/${payload}`, 'DELETE'),

  };
};
