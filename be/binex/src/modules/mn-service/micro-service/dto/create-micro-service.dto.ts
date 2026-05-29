import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Status } from '../../enum/status.enum';

export class CreateMicroServiceDto {
  @ApiProperty({ example: 'Tên chức năng của dịch vụ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'CHỨC_NĂNG_CODE', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ example: 'Mô tả chức năng của dịch vụ' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @ApiProperty({ example: 'ph:briefcase-duotone', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    example: 'https://example.com/thumbnail.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ example: Status.ACTIVE, required: false })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
