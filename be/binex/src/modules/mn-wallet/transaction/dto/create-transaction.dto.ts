import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CurrencyType } from '../../../../constants/enum/currency.enum';
import {
  StatusTranslateEnum,
  TypeTranslateEnum,
} from '../enum/type-translate.enum';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: CurrencyType;

  @ApiProperty()
  type: TypeTranslateEnum;

  @ApiProperty()
  status: StatusTranslateEnum;
}
