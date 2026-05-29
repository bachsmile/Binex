import { ApiProperty } from '@nestjs/swagger';

export class AddFiEvTokenDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  point: number;

  @ApiProperty()
  price: number;
}
