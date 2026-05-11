/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CreateCryptoDto } from '~/types/payload/create-crypto';

export const useCryptoApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateCryptoDto) => 
      api.call<ApiResponse<any>, ApiError>('/finance/crypto', 'POST', payload),

    findAll: () => 
      api.call<ApiResponse<any>, ApiError>('/finance/crypto', 'GET'),

    findOne: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/crypto/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/crypto/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<ApiResponse<any>, ApiError>(`/finance/crypto/${payload}`, 'DELETE'),

  };
};
