/** Auto-generated response */
import type { WeddingServiceType, GuestStatus, GuestSide } from '../enums/wedding';
import type { User } from './user';

export interface Wedding {
  id: string;
  name: string;
  description: string;
  groomName: string;
  groomPhone: string;
  fatherGroomName: string;
  motherGroomName: string;
  brideName: string;
  bridePhone: string;
  fatherBrideName: string;
  motherBrideName: string;
  weddingDate: Date;
  inviteDate: Date;
  ceremonyTime: string;
  venueName: string;
  venueAddress: string;
  inviteAddress: string;
  userId: string;
  status: string;
  qrCode: string;
  budget: number;
  guestCount: number;
  expireDays: number;
  note: string;
  images: string[];
  videos: string[];
  webId: string;
  cardId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: string;
  updatedBy: string;
  autoSend: boolean;
  isDeleted: boolean;
  user: User;
  wdWeb: WdWeb;
  wdCard: WdCard;
  guests: Guest[];
}

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
  description: string;
  isMnWedding: boolean;
  isMnGift: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WdWeb {
  id: string;
  name: string;
  description: string;
  userId: string;
  status: string;
  price: string;
  expire: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  deletedBy: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
  wdId: string;
  user: User;
  wedding: Wedding;
}

export interface WdCard {
  id: string;
  name: string;
  description: string;
  price: string;
  amount: number;
  userId: string;
  status: string;
  createdAt: Date;
  wdId: string;
  user: User;
  wedding: Wedding;
}

export interface Guest {
  id: string;
  fullName: string; // Họ tên khách mời
  phone: string; // Số điện thoại
  email: string; // Địa chỉ email
  side: GuestSide; // Thuộc phía nhà trai hay nhà gái
  status: GuestStatus; // Trạng thái xác nhận tham gia
  address: string; // Địa chỉ của khách
  tableNumber: string; // Số bàn sắp xếp
  adultCount: number; // Số người lớn tham gia
  childrenCount: number; // Số trẻ em tham gia
  token: string; // Token dùng cho link xác nhận tham gia cá nhân
  weddingId: string; // ID của đám cưới liên kết
  wedding: Wedding;
  createdAt: Date;
  updatedAt: Date;
}

