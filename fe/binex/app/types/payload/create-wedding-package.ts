/** Auto-generated payload */
import type { WeddingServiceType } from '../enums/wedding-package';

export interface CreateWeddingPackageDto {

  /**
   * example: Gói Kim Cương
   */
  name: string;

  type: WeddingServiceType;

  /**
   * example: 5000
   */
  priceCardInit?: number;

  /**
   * example: 1000000
   */
  priceWebInit?: number;

  /**
   * example: 20000
   */
  priceGiftInit?: number;

  /**
   * example: 100
   */
  amountCard?: number;

  /**
   * example: 1
   */
  amountWeb?: number;

  /**
   * example: 50
   */
  amountGiftInit?: number;

  /**
   * example: 2000
   */
  price?: number;

  /**
   * example: Mô tả chi tiết gói dịch vụ
   */
  description?: string;

  /**
   * example: true
   */
  isMnWedding?: boolean;

  /**
   * example: true
   */
  isMnGift?: boolean;

  /**
   * example: active
   */
  status?: string;

}

