/** Auto-generated payload */


export interface GetNewsQueryDto {

  /**
   * Trang hiện tại
   */
  page?: number;

  /**
   * Số bản ghi trên mỗi trang
   */
  limit?: number;

  /**
   * Lọc theo danh mục
   */
  category?: string;

  /**
   * Lọc bài viết nổi bật
   */
  isFeatured?: string;

  /**
   * Lọc bài viết quảng cáo
   */
  isAd?: string;

}

