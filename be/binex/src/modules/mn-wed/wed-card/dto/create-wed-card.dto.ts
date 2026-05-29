import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWedCardDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ default: 'active' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  autoSend?: boolean;

  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  type?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  wedId: string;
}
