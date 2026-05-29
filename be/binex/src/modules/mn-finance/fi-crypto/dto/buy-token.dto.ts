import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { CurrencyType } from 'src/constants/enum/currency.enum';

export class BuyTokenDto {
  @ApiProperty({ enum: CurrencyType })
  @IsNotEmpty()
  @IsEnum(CurrencyType)
  currency: CurrencyType; // e.g. BTC, ETH

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number; // price per token in paymentCurrency

  @ApiProperty({ enum: CurrencyType })
  @IsNotEmpty()
  @IsEnum(CurrencyType)
  paymentCurrency: CurrencyType; // e.g. VND, USDT
}
