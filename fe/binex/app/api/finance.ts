/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { CreateCryptoDto } from '~/types/payload/finance';
import type { UpdateCryptoDto } from '~/types/payload/finance';

export const useFinanceApi = () => {
  const api = useApi();
  return {
    create: (payload: CreateCryptoDto) => 
      api.call<any, ApiError>('/finance/crypto', 'POST', payload),

    findAll: () => 
      api.call<any, ApiError>('/finance/crypto', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/finance/crypto/:id', 'GET'),

    update: (payload: UpdateCryptoDto) => 
      api.call<any, ApiError>('/finance/crypto/:id', 'PATCH', payload),

    remove: () => 
      api.call<any, ApiError>('/finance/crypto/:id', 'DELETE'),

  };
};
