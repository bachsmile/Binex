/** Auto-generated response */
import type { Wedding, WdWeb, WdCard } from './wedding';
import type { UserStatus } from '../enums/user';
import type { Role } from '../enums/auth';

export interface User {

  id: string;


  userName: string;

  password: string;

  code: string;

  serviceIds: string[];

  invoiceCode: string;

  createdAt: Date;

  updatedAt: Date;

  avatar: string;

  fullName: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  state: string;

  zip: string;

  country: string;

  type: 'enum',
  enum: Role,
  default: Role.USER,
  role: Role;

  type: 'enum',
  enum: UserStatus,
  default: UserStatus.ACTIVE,
  status: UserStatus;



  recordLimit: any; // Giới hạn bản ghi riêng { "key"

  isDeleted: boolean;

  deletedAt: Date;

  deletedBy: string;

  createdBy: string;

  updatedBy: string;

  managerIds: string[];


  walletIds: string[];

  packageIds: string[];

  weddings: Wedding[];

  wdWebs: WdWeb[];

  wdCards: WdCard[];

  userPermissions: UserPermission[];

}

export interface UserPermission {

  id: string;


  serId: string;

  serName: string;

  packId: string;

  packName: string;

  ac: number;

  userId: string;

  expiredAt: Date;

  user: User;

  createdAt: Date;

  updatedAt: Date;

}

