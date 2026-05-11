/** Auto-generated payload */
import type { Role } from '../enums/role';

export interface GenerateKeyDto {

  /**
   * example: pkg_123
   * ID của gói dịch vụ
   */
  packageId: string;

  /**
   * example: ser_456
   * ID của dịch vụ
   */
  serviceId: string;

  /**
   * example: Role.ADMIN
   * Role mà người dùng sẽ nhận được sau khi kích hoạt
   */
  role?: Role;

  /**
   * example: 30
   * Số ngày gia hạn (nếu muốn ghi đè gói dịch vụ)
   */
  days?: number;

  /**
   * example: user@example.com
   * Địa chỉ email để gửi mã kích hoạt trực tiếp
   */
  mailto?: string;

}

