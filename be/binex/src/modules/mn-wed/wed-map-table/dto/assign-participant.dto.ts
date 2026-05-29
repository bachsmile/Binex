import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignParticipantDto {
  @ApiProperty({ description: 'ID của khách mời' })
  @IsNotEmpty()
  @IsString()
  participantId: string;

  @ApiProperty({
    description:
      'ID của bàn tiệc (Nếu để null/rỗng thì sẽ giải phóng ghế của khách mời khỏi bàn hiện tại)',
    required: false,
  })
  @IsOptional()
  @IsString()
  tableId?: string | null;
}
