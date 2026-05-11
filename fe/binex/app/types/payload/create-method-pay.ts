/** Auto-generated payload */
import type { MethodPayType } from '../enums/method-pay';

export interface CreateMethodPayDto {

  /**
   * example: Ngân hàng Vietcombank
   */
  name: string;

  /**
   * example: 1234567890
   */
  bankNumber: string;

  /**
   * example: 9704...
   */
  cardNumber?: string;

  /**
   * example: NGUYEN VAN A
   */
  accountHolderName: string;

  /**
   * example: Vietcombank
   */
  bankName: string;

  /**
   * example: https://...
   */
  QRCode?: string;

  /**
   * example: VCB
   */
  code: string;

  type: MethodPayType;

  /**
   * example: active
   */
  status?: string;

}

