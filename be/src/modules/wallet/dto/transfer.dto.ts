import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: '0xB...vnd' })
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'VND' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}
