/** Auto-generated response */
import type { Wedding } from './wedding';
import type { WdWeb } from './wd-web';
import type { WdCard } from './wd-card';
import type { UserStatus } from '../enums/user';
import type { UserSubscription } from './user-subscription';
import type { MethodPay } from './method-pay';
import type { Role } from '../enums/role';

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

  role: Role;

  status: UserStatus;

  usedStorage: number; // Tổng dung lượng đã dùng (MB);

  storageLimit: number; // Giới hạn dung lượng riêng (MB), 0 là dùng theo gói;

  recordLimit: any; // Giới hạn bản ghi riêng { "key";

  isDeleted: boolean;

  deletedAt: Date;

  deletedBy: string;

  createdBy: string;

  updatedBy: string;

  managerIds: string[];

  weddings: Wedding[];

  wdWebs: WdWeb[];

  wdCards: WdCard[];

  userSubscriptions: UserSubscription[];

  methodPays: MethodPay[];

}

