import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Wedding' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'WEDDING', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ example: 'Wedding services including cards and web' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @ApiProperty({ example: 'ph:briefcase-duotone', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: '2026-04-29T00:00:00Z', required: false })
  @IsString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ example: '2026-04-29T00:00:00Z', required: false })
  @IsString()
  @IsOptional()
  updatedAt?: string;

  @ApiProperty({
    example: 'https://example.com/thumbnail.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
