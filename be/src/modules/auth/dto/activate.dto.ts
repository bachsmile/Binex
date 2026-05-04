import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateDto {
  @ApiProperty({ example: 'ABCD1234', description: 'Mã kích hoạt' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'user_123', description: 'ID người dùng cần kích hoạt' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
