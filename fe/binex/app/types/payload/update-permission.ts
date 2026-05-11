/** Auto-generated payload */
import type { User } from '../response/user';

export interface PermissionItem {

  /**
   * example: ser_id_123
   */
  serId?: string;

  /**
   * example: User
   */
  serName: string;

  /**
   * example: pack_id_456
   */
  packId?: string;

  /**
   * example: Basic
   */
  packName: string;

  /**
   * example: 15
   * Quyền hạn (1: xem
   */
  ac: number;

  /**
   * example: 2026-12-31T23:59:59Z
   */
  expiredAt?: string;

}

export interface UpdatePermissionDto {

  /**
   * Danh sách các quyền của người dùng
   */
  permissions: PermissionItem[];

}

