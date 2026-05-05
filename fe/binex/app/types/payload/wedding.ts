/** Auto-generated payload */
import type { WeddingServiceType, GuestStatus, GuestSide } from '../enums/wedding';

export interface UpdateGuestDto {

}

export interface CreateGuestDto {
  fullName: string;
  phone?: string;
  email?: string;
  side?: GuestSide;
  status?: GuestStatus;
  address?: string;
  note?: string;
  tableNumber?: string;
  adultCount?: number;
  childrenCount?: number;
  weddingId: string;
}

export interface CreateWdCardDto {
  name: string;
  description: string;
  price: string;
  amount: number;
  status: string;
  wdId: string;
}

export interface UpdateWeddingDto {

}

export interface CreateWeddingDto {
  name?: string;
  description?: string;
  groomName: string;
  groomPhone?: string;
  fatherGroomName?: string;
  motherGroomName?: string;
  brideName: string;
  bridePhone?: string;
  fatherBrideName?: string;
  motherBrideName?: string;
  weddingDate: string;
  inviteDate?: string;
  ceremonyTime?: string;
  venueName: string;
  venueAddress: string;
  inviteAddress?: string;
  guestCount?: number;
  budget?: number;
  qrCode?: string;
  note?: string;
  status?: string;
  createdBy?: string;
  autoSend?: boolean;
  updatedBy?: string;
  isDeleted?: boolean;
  images?: string[];
  videos?: string[];
}

export interface UpdateWeddingPackageDto {

}

export interface CreateWeddingPackageDto {
  name: string;
  type: WeddingServiceType;
  priceCardInit?: number;
  priceWebInit?: number;
  priceGiftInit?: number;
  amountCard?: number;
  amountWeb?: number;
  amountGiftInit?: number;
  price: number;
  description?: string;
  isMnWedding?: boolean;
  isMnGift?: boolean;
  status?: string;
}

export interface UpdateWdCardDto {

}

export interface CreateWdCardDto {
  name: string;
  description: string;
  price: string;
  amount: number;
  status: string;
  wdId: string;
}

