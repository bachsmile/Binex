import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: '0xB...vnd' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 100000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'VND' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: '01HX...', required: false })
  @IsString()
  @IsOptional()
  methodPayId?: string;

  @ApiProperty({ example: 'Nạp tiền qua Vietcombank', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
