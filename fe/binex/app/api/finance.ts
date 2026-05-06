/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateCryptoDto } from '~/types/payload/finance';

export const useFinanceApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateCryptoDto) => 
      api.call<any, ApiError>('/finance/crypto', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/finance/crypto', 'GET'),

    findOne: (payload: string) => 
      api.call<any, ApiError>(`/finance/crypto/${payload}`, 'GET'),

    update: (payload: string) => 
      api.call<any, ApiError>(`/finance/crypto/${payload}`, 'PATCH'),

    remove: (payload: string) => 
      api.call<any, ApiError>(`/finance/crypto/${payload}`, 'DELETE'),

  };
};
