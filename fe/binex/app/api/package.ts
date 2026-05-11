/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreatePackageDto } from '~/types/payload/create-package';
import type { GetPackagesByIdsDto } from '~/types/payload/get-packages-by-ids';

export const usePackageApi = () => {
  const api = useApi();
  return {
    updateRecordLimit: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/package/${payload}/record-limit`, 'PATCH'),

    create: (payload: CreatePackageDto) => 
      api.call<ApiResponse<any>, ApiError>('/package', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/package', 'GET'),

    findDetailsByIds: (payload: GetPackagesByIdsDto) => 
      api.call<ApiResponse<any>, ApiError>('/package/details', 'POST', payload),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/package/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/package/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/package/${payload}`, 'DELETE'),

    removeAll: () => 
      api.call<ApiResponse<any>, ApiError>('/package', 'DELETE'),

  };
};
