/** Auto-generated API */
import type { ApiError } from '~/types/api-error';


export const useWalletApi = () => {
  const api = useApi();
  return {
    findMyTransactions: () => 
      api.call<any, ApiError>('/transaction/my', 'GET'),

    findByAddress: () => 
      api.call<any, ApiError>('/transaction/address/:address', 'GET'),

    findOne: () => 
      api.call<any, ApiError>('/transaction/:id', 'GET'),

  };
};
