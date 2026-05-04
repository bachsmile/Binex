import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreatePackageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sale?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isGroup: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amountGroup: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  expire: number;

  @ApiProperty({
    example: 1024,
    description: 'Giới hạn dung lượng (MB)',
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  storageLimit?: number;

  @ApiProperty({
    example: { '1': 10, '2': 100 },
    description: 'Giới hạn số lượng bản ghi theo loại',
    default: {},
  })
  @IsObject()
  @IsOptional()
  recordLimit?: object;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  ser: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  updatedAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  createdAt: Date;
}
