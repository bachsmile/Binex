/** Auto-generated response */
import type { WeddingServiceType } from '../enums/wedding-package';

export interface WeddingPackage {

  id: string;


  name: string;

  type: WeddingServiceType;

  priceCardInit: number;

  priceWebInit: number;

  priceGiftInit: number;

  amountCard: number;

  amountWeb: number;

  amountGiftInit: number;

  price: number;

  description?: string;

  isMnWedding?: boolean;

  isMnGift?: boolean;

  status: string;

  createdAt: Date;

  updatedAt: Date;

}

