/** Auto-generated response */
import type { Wedding } from './wedding';
import type { GuestStatus, GuestSide } from '../enums/guest';

export interface Guest {

  id: string;


  fullName: string; // Họ tên khách mời;

  phone: string; // Số điện thoại;

  email: string; // Địa chỉ email;

  side: GuestSide; // Thuộc phía nhà trai hay nhà gái;

  status: GuestStatus; // Trạng thái xác nhận tham gia;

  address: string; // Địa chỉ của khách;

  note: string; // Ghi chú (ví dụ;

  tableNumber: string; // Số bàn sắp xếp;

  adultCount: number; // Số người lớn tham gia;

  childrenCount: number; // Số trẻ em tham gia;

  token: string; // Token dùng cho link xác nhận tham gia cá nhân;

  weddingId: string; // ID của đám cưới liên kết;

  wedding: Wedding;

  createdAt: Date;

  updatedAt: Date;

}

