import type { ApiError } from '~/types/api-error';
import type { ApiResponse, ApiListResponse } from '~/types/api-response';
import type { PaymentRequest } from '~/types/payment-request';

export const usePayApi = () => {
  const api = useApi();
  return {
    ...api,

    getPaymentRequests: (payload?: { serviceId?: string; status?: string; page?: number; limit?: number }) => 
      api.call<ApiListResponse<PaymentRequest>, ApiError>('/pay/manual/requests', 'GET', payload),

    verifyManualPayment: (requestId: string, status: string, adminNote?: string) => {
      let url = `/pay/manual/verify?requestId=${requestId}&status=${status}`;
      if (adminNote) {
        url += `&adminNote=${encodeURIComponent(adminNote)}`;
      }
      return api.call<ApiResponse<PaymentRequest>, ApiError>(url, 'PATCH');
    }
  };
};
