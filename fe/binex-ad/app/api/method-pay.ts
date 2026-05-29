import type { ApiError } from '~/types/api-error';
import type { ApiResponse } from '~/types/api-response';
import type { MethodPay } from '~/types/method-pay';

export const useMethodPayApi = () => {
  const api = useApi();
  return {
    ...api,

    findAll: (params?: { userId?: string }) => 
      api.call<ApiResponse<MethodPay[]>, ApiError>('/method-pay', 'GET', params),

    findMine: () =>
      api.call<ApiResponse<MethodPay[]>, ApiError>('/method-pay/mine', 'GET'),

    findSystem: () =>
      api.call<ApiResponse<MethodPay[]>, ApiError>('/method-pay/system', 'GET'),

    findOne: (id: string) =>
      api.call<ApiResponse<MethodPay>, ApiError>(`/method-pay/${id}`, 'GET'),

    create: (payload: Partial<MethodPay>) => 
      api.call<ApiResponse<MethodPay>, ApiError>('/method-pay', 'POST', payload),

    update: (id: string, payload: Partial<MethodPay>) => 
      api.call<ApiResponse<MethodPay>, ApiError>(`/method-pay/${id}`, 'PATCH', payload),

    remove: (id: string) => 
      api.call<ApiResponse<any>, ApiError>(`/method-pay/${id}`, 'DELETE'),
  };
};
