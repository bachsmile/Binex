import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { CurrencyType } from 'src/constants/enum/currency.enum';

export class DepositToFinanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  walletAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  currency: CurrencyType; // VND, USDT

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  twoFactorToken: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;
}
