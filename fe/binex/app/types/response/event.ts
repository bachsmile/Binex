/** Auto-generated response */
import type { User } from './user';
import type { EventStatus } from '../enums/event';

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  image: string;
  createdBy: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

