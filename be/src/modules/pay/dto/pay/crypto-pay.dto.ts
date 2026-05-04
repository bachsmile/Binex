import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CryptoPayDto {
  @ApiProperty({
    example: '0x...',
    description: 'Địa chỉ ví người nhận (mặc định là ví Super Admin)',
    required: false,
  })
  @IsString()
  @IsOptional()
  toAddress?: string;

  @ApiProperty({ example: 0.1, description: 'Số tiền thanh toán' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'ETH', description: 'Loại tiền (ETH, MATIC, v.v.)' })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ example: 'invoice_123', description: 'Mã hóa đơn' })
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
