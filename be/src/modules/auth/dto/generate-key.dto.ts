import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateKeyDto {
  @ApiProperty({ example: 'pkg_123', description: 'ID của gói dịch vụ' })
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiProperty({ example: 'ser_456', description: 'ID của dịch vụ' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({
    example: Role.ADMIN,
    description: 'Role mà người dùng sẽ nhận được sau khi kích hoạt',
    enum: Role,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({
    example: 30,
    description: 'Số ngày gia hạn (nếu muốn ghi đè gói dịch vụ)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  days?: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Địa chỉ email để gửi mã kích hoạt trực tiếp',
    required: false,
  })
  @IsString()
  @IsOptional()
  mailto?: string;
}
