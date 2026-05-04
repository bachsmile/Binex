import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'user123' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty({ example: 'service123' })
  @IsString()
  @IsOptional()
  serviceId: string;

  @ApiProperty({ example: 'INV123456' })
  @IsString()
  @IsOptional()
  invoiceCode: string;
}
