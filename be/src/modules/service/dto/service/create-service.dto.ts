import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Wedding' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Wedding services including cards and web' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @ApiProperty({ example: '2026-04-29T00:00:00Z', required: false })
  @IsString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ example: '2026-04-29T00:00:00Z', required: false })
  @IsString()
  @IsOptional()
  updatedAt?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  packageIds?: string[];
}
