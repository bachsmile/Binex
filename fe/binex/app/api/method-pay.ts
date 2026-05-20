/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';


export const useMethodPayApi = () => {
  const api = useApi();
  return {
    create: () => 
      api.call<ApiResponse<any>, ApiError>('/method-pay', 'POST'),

    findMine: () => 
      api.call<ApiResponse<any>, ApiError>('/method-pay/mine', 'GET'),

    findSystem: () => 
      api.call<ApiResponse<any>, ApiError>('/method-pay/system', 'GET'),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/method-pay', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/method-pay/${payload}`, 'GET'),

    update: (payload: any) => 
      api.call<ApiResponse<any>, ApiError>(`/method-pay/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/method-pay/${payload}`, 'DELETE'),

  };
};
