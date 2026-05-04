import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLimitTypeDto {
  @ApiProperty({
    example: 'key_limit',
    description: 'Key định danh của loại giới hạn',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Giới hạn số lượng', description: 'Tên hiển thị' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Số lượng tối đa người dùng có thể tạo',
    description: 'Mô tả chi tiết',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Bản ghi',
    description: 'Đơn vị tính',
    required: false,
  })
  @IsString()
  @IsOptional()
  unit?: string;
}
