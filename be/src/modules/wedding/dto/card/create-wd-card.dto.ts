import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWdCardDto {
  @ApiProperty({ example: 'Thiệp mời sang trọng' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Mẫu thiệp phong cách hiện đại' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '5000' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'pendding' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: '01AN4V07BY7WPLKAWSYCQCDWZW' })
  @IsString()
  @IsNotEmpty()
  wdId: string;
}
