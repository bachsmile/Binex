import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AddFiEvFeeDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  fee: number;

  @ApiProperty({ required: false })
  @IsOptional()
  point?: number;
}
