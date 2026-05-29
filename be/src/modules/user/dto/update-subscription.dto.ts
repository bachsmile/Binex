import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNumber,
  ValidateNested,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubscriptionItem {
  @ApiProperty({ example: 'pack_id_456', required: false })
  @IsString()
  @IsOptional()
  packId?: string;

  @ApiProperty({ example: 'SER_001', required: false })
  @IsString()
  @IsOptional()
  serviceId?: string;

  @ApiProperty({
    example: 15,
    description: 'Quyền hạn (1: xem, 2: sửa, 4: xóa, 8: thêm)',
  })
  @IsNumber()
  ac: number;

  @ApiProperty({ example: '2026-12-31T23:59:59Z', required: false })
  @IsDateString()
  @IsOptional()
  expiredAt?: string;
}

export class UpdateSubscriptionDto {
  @ApiProperty({
    type: [SubscriptionItem],
    description: 'Danh sách đăng ký gói dịch vụ của người dùng',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionItem)
  subscriptions: SubscriptionItem[];
}
