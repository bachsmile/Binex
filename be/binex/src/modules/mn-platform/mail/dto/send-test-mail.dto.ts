import { ApiProperty } from '@nestjs/swagger';

export class SendTestMailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Địa chỉ email người nhận',
  })
  mailto: string;

  @ApiProperty({
    example: 'Gói Cơ Bản',
    description: 'Tên gói dịch vụ (tùy chọn)',
    required: false,
  })
  packageName?: string;

  @ApiProperty({
    example: 'TEST-KEY-123',
    description: 'Mã kích hoạt (tùy chọn)',
    required: false,
  })
  key?: string;
}
