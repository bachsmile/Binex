/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateOrderDto } from '~/types/payload/create-order';
import type { Order } from '~/types/response/order';

export const useOrderApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateOrderDto) => 
      api.call<ApiResponse<Order>, ApiError>('/orders', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<Order[]>, ApiError>('/orders', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<Order>, ApiError>(`/orders/${payload}`, 'GET'),

    updateStatus: (payload: any) => 
      api.call<ApiResponse<Order>, ApiError>(`/orders/${payload}/status`, 'PATCH'),

  };
};
