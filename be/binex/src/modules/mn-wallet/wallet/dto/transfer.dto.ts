import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TransferDto {
  @ApiProperty({
    example: 'evn_sender_wallet_address_here',
    description: 'Địa chỉ ví người thanh toán',
  })
  @IsString()
  @IsNotEmpty()
  senderAddress: string;

  @ApiProperty({
    example: 'evn_receiver_wallet_address_here',
    description: 'Địa chỉ ví người nhận',
  })
  @IsString()
  @IsNotEmpty()
  receiverAddress: string;

  @ApiProperty({ example: 10000, description: 'Số tiền chuyển' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0.000001)
  amount: number;

  @ApiProperty({
    example: 'VND',
    description: 'Loại tiền tệ (VND hoặc USD/USDT)',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    example: '123456',
    description: 'Mã xác thực 2FA của người thanh toán',
  })
  @IsString()
  @IsNotEmpty()
  twoFactorToken: string;

  @ApiProperty({
    example: 'Thanh toán hóa đơn',
    required: false,
    description: 'Mô tả giao dịch',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
