import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserRecordLimitDto {
  @ApiProperty({ example: 'lm_wedd', description: 'Key giới hạn (ví dụ: lm_wedd)' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 10, description: 'Giá trị giới hạn (0 là dùng theo gói)' })
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
