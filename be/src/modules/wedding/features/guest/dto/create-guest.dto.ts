import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { GuestSide, GuestStatus } from '../../../entities/guest.entity';

export class CreateGuestDto {
  @ApiProperty({ example: 'Nguyễn Văn Khách' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'khach@example.com', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: GuestSide, default: GuestSide.GROOM })
  @IsEnum(GuestSide)
  @IsOptional()
  side?: GuestSide;

  @ApiProperty({ enum: GuestStatus, default: GuestStatus.PENDING })
  @IsEnum(GuestStatus)
  @IsOptional()
  status?: GuestStatus;

  @ApiProperty({ example: 'Hà Nội', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Người thân', required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ example: 'A1', required: false })
  @IsString()
  @IsOptional()
  tableNumber?: string;

  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  @IsOptional()
  adultCount?: number;

  @ApiProperty({ example: 0, default: 0 })
  @IsNumber()
  @IsOptional()
  childrenCount?: number;

  @ApiProperty({ description: 'ID của đám cưới' })
  @IsString()
  @IsNotEmpty()
  weddingId: string;
}
