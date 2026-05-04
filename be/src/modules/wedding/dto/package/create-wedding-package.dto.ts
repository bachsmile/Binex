import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { WeddingServiceType } from '../../entities/wedding-package.entity';

export class CreateWeddingPackageDto {
  @ApiProperty({ example: 'Gói Kim Cương' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: WeddingServiceType, default: WeddingServiceType.CARD })
  @IsEnum(WeddingServiceType)
  @IsNotEmpty()
  type: WeddingServiceType;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @IsOptional()
  priceCardInit?: number;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  @IsOptional()
  priceWebInit?: number;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @IsOptional()
  priceGiftInit?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsOptional()
  amountCard?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  amountWeb?: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @IsOptional()
  amountGiftInit?: number;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ example: 'Mô tả chi tiết gói dịch vụ', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isMnWedding?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isMnGift?: boolean;

  @ApiProperty({ example: 'active', default: 'pending' })
  @IsString()
  @IsOptional()
  status?: string;
}
