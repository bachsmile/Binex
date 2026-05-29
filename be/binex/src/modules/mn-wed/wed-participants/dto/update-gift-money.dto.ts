import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateGiftMoneyDto {
  @ApiProperty({ description: 'Số tiền mừng cưới', example: 500000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  giftMoney: number;
}
