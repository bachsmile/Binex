import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MethodPayType } from '../../entities/method-pay.entity';

export class CreateMethodPayDto {
  @ApiProperty({ example: 'Ngân hàng Vietcombank' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  bankNumber: string;

  @ApiProperty({ example: '9704...', required: false })
  @IsString()
  @IsOptional()
  cardNumber?: string;

  @ApiProperty({ example: 'NGUYEN VAN A' })
  @IsString()
  @IsNotEmpty()
  accountHolderName: string;

  @ApiProperty({ example: 'Vietcombank' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({ example: 'https://...', required: false })
  @IsString()
  @IsOptional()
  QRCode?: string;

  @ApiProperty({ example: 'VCB' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: MethodPayType, default: MethodPayType.ACCOUNT_NUMBER })
  @IsEnum(MethodPayType)
  @IsNotEmpty()
  type: MethodPayType;

  @ApiProperty({ example: 'active', default: 'active' })
  @IsString()
  @IsOptional()
  status?: string;
}
