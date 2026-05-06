import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class UpdateParticipantsDto {
  @ApiProperty({
    description: 'Danh sách ID người dùng tham gia',
    example: ['user-id-1', 'user-id-2'],
  })
  @IsArray()
  @IsString({ each: true })
  participantIds: string[];
}
