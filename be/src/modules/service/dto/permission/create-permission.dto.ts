import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ description: 'ID của service' })
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({
    description: 'Action permission, ví dụ: user.read, landing_page.edit',
    example: 'user.read',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional({
    description: 'Trọng số quyền: 1=read, 2=create, 4=update, 8=delete',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;
}
