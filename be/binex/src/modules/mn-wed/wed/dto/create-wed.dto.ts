import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateWedDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  groomName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groomPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fatherGroomName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  motherGroomName?: string;

  @ApiProperty()
  @IsString()
  brideName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bridePhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fatherBrideName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  motherBrideName?: string;

  @ApiProperty()
  @IsDateString()
  weddingDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  inviteDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ceremonyTime?: string;

  @ApiProperty()
  @IsString()
  venueName: string;

  @ApiProperty()
  @IsString()
  venueAddress: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  inviteAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  guestCount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  expireDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  webId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cardId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  autoSend?: boolean;
}
