import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class DepositFromAdminDto {
  @ApiProperty({
    example: 'evn_receiver_wallet_address_here',
    description: 'Địa chỉ ví người nhận',
  })
  @IsString()
  @IsNotEmpty()
  receiverAddress: string;

  @ApiProperty({ example: 100000, description: 'Số tiền nạp' })
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
    description: 'Mã PIN bảo mật của ví Admin',
  })
  @IsString()
  @IsNotEmpty()
  adminPin: string;

  @ApiProperty({
    example: 'Nạp tiền từ admin Binex',
    required: false,
    description: 'Mô tả giao dịch',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
