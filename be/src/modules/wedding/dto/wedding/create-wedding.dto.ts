import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateWeddingDto {
  @ApiProperty({ example: 'Đám cưới Thế Kỷ', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Mô tả ngắn về ngày vui', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  // 🤵 Groom Information
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  groomName: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsString()
  @IsOptional()
  groomPhone?: string;

  @ApiProperty({ example: 'Nguyễn Văn B', required: false })
  @IsString()
  @IsOptional()
  fatherGroomName?: string;

  @ApiProperty({ example: 'Trần Thị C', required: false })
  @IsString()
  @IsOptional()
  motherGroomName?: string;

  // 👰 Bride Information
  @ApiProperty({ example: 'Lê Thị D' })
  @IsString()
  @IsNotEmpty()
  brideName: string;

  @ApiProperty({ example: '0907654321', required: false })
  @IsString()
  @IsOptional()
  bridePhone?: string;

  @ApiProperty({ example: 'Lê Văn E', required: false })
  @IsString()
  @IsOptional()
  fatherBrideName?: string;

  @ApiProperty({ example: 'Phạm Thị F', required: false })
  @IsString()
  @IsOptional()
  motherBrideName?: string;

  // 📅 Wedding Schedule
  @ApiProperty({ example: '2026-12-25T18:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  weddingDate: string;

  @ApiProperty({ example: '2026-12-20T08:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  inviteDate?: string;

  @ApiProperty({ example: '18:30', required: false })
  @IsString()
  @IsOptional()
  ceremonyTime?: string;

  // 📍 Location
  @ApiProperty({ example: 'Trung tâm tiệc cưới Gem Center' })
  @IsString()
  @IsNotEmpty()
  venueName: string;

  @ApiProperty({ example: '183 Nguyễn Bỉnh Khiêm, Đa Kao, Quận 1' })
  @IsString()
  @IsNotEmpty()
  venueAddress: string;

  @ApiProperty({ example: 'Tư gia nhà gái', required: false })
  @IsString()
  @IsOptional()
  inviteAddress?: string;

  // 👥 Management
  @ApiProperty({ example: 500, required: false })
  @IsNumber()
  @IsOptional()
  guestCount?: number;

  @ApiProperty({ example: 500000000, required: false })
  @IsNumber()
  @IsOptional()
  budget?: number;

  @ApiProperty({ example: 'https://wedding.com/abc', required: false })
  @IsString()
  @IsOptional()
  qrCode?: string;

  @ApiProperty({ example: 'Lưu ý đặc biệt cho đám cưới', required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ example: 'draft', default: 'draft', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2026-12-25T18:00:00Z', required: false })
  @IsString()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({ example: '2026-12-25T18:00:00Z', required: false })
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
