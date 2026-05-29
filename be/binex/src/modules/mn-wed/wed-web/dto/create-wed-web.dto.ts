import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWedWebDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty({ default: 365 })
  @IsOptional()
  @IsNumber()
  expire?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  wedId: string;
}
