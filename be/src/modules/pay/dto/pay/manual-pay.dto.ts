import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ManualPayDto {
  @ApiProperty({ example: 'order_123', description: 'Mã đơn hàng' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ example: 100000, description: 'Số tiền đã chuyển' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    example: 'TX123456789',
    description: 'Mã giao dịch ngân hàng',
  })
  @IsString()
  @IsNotEmpty()
  transactionCode: string;

  @ApiProperty({
    example: 'https://...',
    description: 'URL ảnh minh chứng thanh toán',
  })
  @IsString()
  @IsOptional()
  proofImage?: string;

  @ApiProperty({
    example: '01J...',
    description: 'ID của phương thức thanh toán đã chọn',
  })
  @IsString()
  @IsNotEmpty()
  methodPayId: string;
}
