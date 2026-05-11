/** Auto-generated payload */
import type { EventStatus } from '../enums/event';

export interface CreateEventDto {

  /**
   * example: Tên sự kiện
   */
  name: string;

  /**
   * example: Mô tả về sự kiện
   */
  description?: string;

  /**
   * example: Gem Center
   */
  location?: string;

  /**
   * example: 2026-12-25T18:00:00Z
   */
  startDate: string;

  /**
   * example: 2026-12-25T22:00:00Z
   */
  endDate?: string;

  status?: EventStatus;

  /**
   * example: https://example.com/banner.jpg
   */
  image?: string;

  createdBy?: string;

}

