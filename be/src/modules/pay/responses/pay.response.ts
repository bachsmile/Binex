import { ApiProperty } from '@nestjs/swagger';

export class CryptoPayResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ required: false })
  transactionHash?: string;

  @ApiProperty({ required: false })
  orderId?: string;

  @ApiProperty({ required: false })
  blockNumber?: number;

  @ApiProperty({ required: false })
  message?: string;
}

export class BalanceResponse {
  @ApiProperty()
  address: string;

  @ApiProperty()
  balance: string;

  @ApiProperty({ example: 'ETH' })
  symbol: string;
}

export class AdminWalletResponse {
  @ApiProperty()
  address: string;
}

export class VerifyPaymentResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false })
  transactionHash?: string;

  @ApiProperty({ required: false })
  from?: string;

  @ApiProperty({ required: false })
  amount?: string;

  @ApiProperty({ required: false })
  message?: string;
}

export class PaymentRequestListResponse {
  @ApiProperty()
  data: any[];

  @ApiProperty()
  total: number;
}
