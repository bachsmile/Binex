import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PermissionItem {
  @ApiProperty({ example: 'User' })
  @IsString()
  serName: string;

  @ApiProperty({ example: 'Basic' })
  @IsString()
  packName: string;

  @ApiProperty({
    example: 15,
    description: 'Quyền hạn (1: xem, 2: sửa, 4: xóa, 8: thêm)',
  })
  @IsNumber()
  ac: number;
}

export class UpdatePermissionDto {
  @ApiProperty({
    type: [PermissionItem],
    description: 'Danh sách các quyền của người dùng',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionItem)
  permissions: PermissionItem[];
}
