/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CryptoPayDto } from '~/types/payload/crypto-pay';
import type { ManualPayDto } from '~/types/payload/manual-pay';

export const usePayApi = () => {
  const api = useApi();
  return {
    payWithCrypto: (payload: CryptoPayDto) => 
      api.call<ApiResponse<any>, ApiError>('/pay/crypto', 'POST', payload),

    getBalance: () => 
      api.call<ApiResponse<any>, ApiError>('/pay/balance', 'GET'),

    getAdminWallet: () => 
      api.call<ApiResponse<any>, ApiError>('/pay/admin-wallet', 'GET'),

    verifyPayment: () => 
      api.call<ApiResponse<any>, ApiError>('/pay/verify-payment', 'POST'),

    submitManualPayment: (payload: ManualPayDto) => 
      api.call<ApiResponse<any>, ApiError>('/pay/manual', 'POST', payload),

    verifyManualPayment: () => 
      api.call<ApiResponse<any>, ApiError>('/pay/manual/verify', 'PATCH'),

    getPaymentRequests: () => 
      api.call<ApiResponse<any>, ApiError>('/pay/manual/requests', 'GET'),

  };
};
