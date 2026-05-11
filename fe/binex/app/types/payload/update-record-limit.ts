/** Auto-generated payload */
import type { LimitType } from '../response/limit-type';

export interface UpdateUserRecordLimitDto {

  /**
   * example: lm_wedd
   * Key giới hạn (ví dụ: lm_wedd)
   */
  key: string;

  /**
   * example: 10
   * Giá trị giới hạn (0 là dùng theo gói)
   */
  value: number;

}

export interface UpdatePackageRecordLimitDto {

  /**
   * example: wedding
   * Key giới hạn (đã định nghĩa trong LimitType)
   */
  key: string;

  /**
   * example: 10
   * Giá trị giới hạn (0 là không giới hạn)
   */
  value: number;

}

