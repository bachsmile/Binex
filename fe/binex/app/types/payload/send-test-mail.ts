/** Auto-generated payload */


export interface SendTestMailDto {

  /**
   * example: user@example.com
   * Địa chỉ email người nhận
   */
  mailto: string;

  /**
   * example: Gói Cơ Bản
   * Tên gói dịch vụ (tùy chọn)
   */
  packageName?: string;

  /**
   * example: TEST-KEY-123
   * Mã kích hoạt (tùy chọn)
   */
  key?: string;

}

