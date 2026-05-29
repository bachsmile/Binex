import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';

export interface PackageItem {
  id?: string;
  name: string;
  description: string;
  price: string;
  isGroup: boolean;
  amountGroup: number;
  sale?: number;
  expire: number;
  storageLimit: number;
  recordLimit?: any;
  serviceId: string;
  ac: number;
  serviceIds?: string[];
  services?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export const usePackageApi = () => {
  const api = useApi();
  return {
    ...api,

    findAll: () => 
      api.call<ApiListResponse<PackageItem>, ApiError>('/package', 'GET'),

    findOne: (id: string) =>
      api.call<ApiResponse<PackageItem>, ApiError>(`/package/${id}`, 'GET'),

    create: (payload: Partial<PackageItem>) => 
      api.call<ApiResponse<PackageItem>, ApiError>('/package', 'POST', payload),

    update: (id: string, payload: Partial<PackageItem>) => 
      api.call<ApiResponse<PackageItem>, ApiError>(`/package/${id}`, 'PATCH', payload),

    remove: (id: string) => 
      api.call<ApiResponse<PackageItem>, ApiError>(`/package/${id}`, 'DELETE'),
  };
};
