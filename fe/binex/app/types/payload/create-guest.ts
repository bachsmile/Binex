/** Auto-generated payload */
import type { GuestStatus, GuestSide } from '../enums/guest';

export interface CreateGuestDto {

  /**
   * example: Nguyễn Văn Khách
   */
  fullName: string;

  /**
   * example: 0901234567
   */
  phone?: string;

  /**
   * example: khach@example.com
   */
  email?: string;

  side?: GuestSide;

  status?: GuestStatus;

  /**
   * example: Hà Nội
   */
  address?: string;

  /**
   * example: Người thân
   */
  note?: string;

  /**
   * example: A1
   */
  tableNumber?: string;

  /**
   * example: 1
   */
  adultCount?: number;

  /**
   * example: 0
   */
  childrenCount?: number;

  /**
   * ID của đám cưới
   */
  weddingId: string;

}

