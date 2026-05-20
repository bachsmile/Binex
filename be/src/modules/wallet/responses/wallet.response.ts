import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '../entities/wallet.entity';

export class WalletResponse {
  @ApiProperty({ type: Wallet })
  data: Wallet;
}

export class WalletListResponse {
  @ApiProperty({ type: [Wallet] })
  data: Wallet[];

  @ApiProperty()
  total: number;
}

export class WalletActionResponse {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ required: false })
  transactionId?: string;

  @ApiProperty({ type: Wallet, required: false })
  data?: Wallet;
}
