/** Auto-generated API */
import type { ApiError } from '~/types/api-error';


export const useWalletApi = () => {
  const api = useApi();
  return {
    findMyTransactions: () => 
      api.call<any, ApiError>('/transaction/my', 'GET'),

    findByAddress: (payload: string) => 
      api.call<any, ApiError>(`/transaction/address/${payload}`, 'GET'),

    findOne: (payload: string) => 
      api.call<any, ApiError>(`/transaction/${payload}`, 'GET'),

  };
};
