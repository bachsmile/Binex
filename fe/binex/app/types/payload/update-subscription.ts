/** Auto-generated payload */


export interface SubscriptionItem {

  /**
   * example: pack_id_456
   */
  packId?: string;

  /**
   * example: SER_001
   */
  serviceId?: string;

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

export interface UpdateSubscriptionDto {

  /**
   * Danh sách đăng ký gói dịch vụ của người dùng
   */
  subscriptions: SubscriptionItem[];

}

