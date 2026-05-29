import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWedMapTableDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string; // E.g. "Bàn 1"

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  areaName: string; // E.g. "VIP", "Nhà Trai"

  @ApiProperty({ default: 10 })
  @IsOptional()
  @IsNumber()
  maxSeats?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  wedId: string;
}
