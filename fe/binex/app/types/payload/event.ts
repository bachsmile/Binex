/** Auto-generated payload */
import type { EventStatus } from '../enums/event';

export interface UpdateEventDto {

}

export interface CreateEventDto {
  name: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  status?: EventStatus;
  image?: string;
  ', required: false })
  weddingId?: string;
  createdBy?: string;
}

