/** Auto-generated payload */


export interface CreateLimitTypeDto {

  /**
   * example: key_limit
   * Key định danh của loại giới hạn
   */
  key: string;

  /**
   * example: Giới hạn số lượng
   * Tên hiển thị
   */
  name: string;

  /**
   * example: Số lượng tối đa người dùng có thể tạo
   * Mô tả chi tiết
   */
  description?: string;

  /**
   * example: Bản ghi
   * Đơn vị tính
   */
  unit?: string;

}

