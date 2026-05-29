import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class ExtendSubscriptionDto {
  @ApiProperty({ example: 30, description: 'Số ngày muốn gia hạn' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  days: number;
}
