/** Auto-generated payload */
import type { EventStatus } from '../enums/event';

export interface UpdateParticipantsDto {

  description: 'Danh sách ID người dùng tham gia',
  example: ['user-id-1', 'user-id-2'],
  participantIds: string[];

}

export interface UpdateEventDto extends Partial<CreateEventDto> {

}

export interface CreateEventDto {

  name: string;

  description?: string;

  location?: string;

  startDate: string;

  endDate?: string;

  enum: EventStatus,
  default: EventStatus.UPCOMING,
  required: false,
  status?: EventStatus;

  image?: string;

  createdBy?: string;

}

