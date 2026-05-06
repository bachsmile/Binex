import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @ApiProperty({ example: 'Tên sự kiện' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Mô tả về sự kiện', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Gem Center, Quận 1', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: '2026-12-25T18:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-12-25T22:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    enum: EventStatus,
    default: EventStatus.UPCOMING,
    required: false,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiProperty({ example: 'https://example.com/banner.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;
}
