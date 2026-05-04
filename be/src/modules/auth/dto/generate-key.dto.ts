import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Role } from 'src/decorators/roles.decorator';
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
}
