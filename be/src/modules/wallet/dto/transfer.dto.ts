import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: '0xB...admin' })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty({ example: '0xB...vnd' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'VND' })
  @IsString()
  @IsIn(['VND', 'USD'])
  @IsNotEmpty()
  currency: string;
}
