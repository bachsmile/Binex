import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderType } from '../../enums/order-type.enum';

export class ManualPayDto {
  @ApiProperty({
    example: 'PK_001',
    description: 'ID của gói',
    required: false,
  })
  @IsString()
  @IsOptional()
  packageId?: string;

  @ApiProperty({
    example: 'SER_001',
    description: 'ID của dịch vụ',
    required: false,
  })
  @IsString()
  @IsOptional()
  serviceId?: string;

  @ApiProperty({ enum: OrderType, description: 'Loại đơn hàng' })
  @IsEnum(OrderType)
  @IsNotEmpty()
  orderType: OrderType;

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
