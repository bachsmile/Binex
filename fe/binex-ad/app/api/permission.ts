import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';

export interface PermissionItem {
  id?: number;
  serviceId?: string;
  packId?: string;
  action: string;  // e.g. user.read, landing_page.edit
  weight?: number; // 1=read, 2=create, 4=update, 8=delete
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkSetPermissionPayload {
  packId: string;
  actions: { action: string; weight?: number }[];
}

export const usePermissionApi = () => {
  const api = useApi();
  return {
    ...api,

    findAll: () =>
      api.call<ApiListResponse<PermissionItem>, ApiError>('/permission', 'GET'),

    findByPackId: (packId: string) =>
      api.call<ApiListResponse<PermissionItem>, ApiError>(
        `/permission/by-pack?packId=${packId}`,
        'GET',
      ),

    findByServiceId: (serviceId: string) =>
      api.call<ApiListResponse<PermissionItem>, ApiError>(
        `/permission/by-service?serviceId=${serviceId}`,
        'GET',
      ),

    findOne: (id: number) =>
      api.call<ApiResponse<PermissionItem>, ApiError>(`/permission/${id}`, 'GET'),

    create: (payload: PermissionItem) =>
      api.call<ApiResponse<PermissionItem>, ApiError>('/permission', 'POST', payload),

    update: (id: number, payload: Partial<PermissionItem>) =>
      api.call<ApiResponse<PermissionItem>, ApiError>(`/permission/${id}`, 'PATCH', payload),

    remove: (id: number) =>
      api.call<ApiResponse<PermissionItem>, ApiError>(`/permission/${id}`, 'DELETE'),

    removeByPackId: (packId: string) =>
      api.call<ApiResponse<{ message: string }>, ApiError>(
        `/permission/by-pack/${packId}`,
        'DELETE',
      ),

    bulkSet: (payload: BulkSetPermissionPayload) =>
      api.call<ApiListResponse<PermissionItem>, ApiError>(
        '/permission/bulk-set',
        'POST',
        payload,
      ),
  };
};
