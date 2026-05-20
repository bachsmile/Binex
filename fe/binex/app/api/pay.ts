/** Auto-generated API */
import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { CryptoPayDto } from '~/types/payload/crypto-pay';
import type { CryptoPayResponse } from '~/types/response/pay';
import type { BalanceResponse } from '~/types/response/pay';
import type { AdminWalletResponse } from '~/types/response/pay';
import type { VerifyPaymentResponse } from '~/types/response/pay';
import type { ManualPayDto } from '~/types/payload/manual-pay';
import type { PaymentRequest } from '~/types/response/payment-request';

export const usePayApi = () => {
  const api = useApi();
  return {
    payWithCrypto: (payload: CryptoPayDto) => 
      api.call<ApiResponse<CryptoPayResponse>, ApiError>('/pay/crypto', 'POST', payload),

    getBalance: () => 
      api.call<ApiResponse<BalanceResponse>, ApiError>('/pay/balance', 'GET'),

    getAdminWallet: () => 
      api.call<ApiResponse<AdminWalletResponse>, ApiError>('/pay/admin-wallet', 'GET'),

    verifyPayment: () => 
      api.call<ApiResponse<VerifyPaymentResponse>, ApiError>('/pay/verify-payment', 'POST'),

    submitManualPayment: (payload: ManualPayDto) => 
      api.call<ApiResponse<PaymentRequest>, ApiError>('/pay/manual', 'POST', payload),

    verifyManualPayment: () => 
      api.call<ApiResponse<PaymentRequest>, ApiError>('/pay/manual/verify', 'PATCH'),

    getPaymentRequests: () => 
      api.call<ApiListResponse<PaymentRequest>, ApiError>('/pay/manual/requests', 'GET'),

  };
};
