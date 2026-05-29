import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'binex1' })
  @IsString()
  @MinLength(4)
  userName: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(4)
  password: string;
}
