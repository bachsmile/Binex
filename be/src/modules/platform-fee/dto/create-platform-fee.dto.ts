import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { FeeType } from '../entities/platform-fee.entity';

export class CreatePlatformFeeDto {
  @ApiProperty({ example: 'PLATFORM_COMMISSION', description: 'Mã định danh duy nhất' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Phí nền tảng' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Phí chiết khấu 10% trên mỗi giao dịch', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: FeeType, default: FeeType.PERCENTAGE })
  @IsEnum(FeeType)
  @IsNotEmpty()
  type: FeeType;

  @ApiProperty({ example: 10, description: 'Giá trị phần trăm hoặc số tiền cố định' })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
