/** Auto-generated response */


export interface CryptoPayResponse {

  success: boolean;

  transactionHash?: string;

  orderId?: string;

  blockNumber?: number;

  message?: string;

}

export interface BalanceResponse {

  address: string;

  balance: string;

  /**
   * example: ETH
   */
  symbol: string;

}

export interface AdminWalletResponse {

  address: string;

}

export interface VerifyPaymentResponse {

  success: boolean;

  status?: string;

  transactionHash?: string;

  from?: string;

  amount?: string;

  message?: string;

}

export interface PaymentRequestListResponse {

  data: any[];

  total: number;

}

