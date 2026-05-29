import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ParticipantSide, ParticipantStatus } from '../enum/participant.enum';

export class CreateWedParticipantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ enum: ParticipantSide, default: ParticipantSide.GROOM })
  @IsNotEmpty()
  @IsEnum(ParticipantSide)
  side: ParticipantSide;

  @ApiProperty({ enum: ParticipantStatus, default: ParticipantStatus.PENDING })
  @IsOptional()
  @IsEnum(ParticipantStatus)
  status?: ParticipantStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tableNumber?: string;

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsNumber()
  adultCount?: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  childrenCount?: number;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  isCardSent?: boolean;

  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @IsNumber()
  giftMoney?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  wedId: string;
}
