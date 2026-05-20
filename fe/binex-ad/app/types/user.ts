export interface UserPermission {
  id: string;
  serId: string | null;
  serName: string | null;
  packId: string | null;
  packName: string | null;
  ac: number;
  userId: string;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  userName: string;
  code: string | null;
  serviceIds: string[] | null;
  invoiceCode: string | null;
  avatar: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  role: string;
  status: string;
  usedStorage: number;
  storageLimit: number;
  recordLimit: Record<string, number>;
  managerIds: string[] | null;
  walletIds: string[] | null;
  packageIds: string[] | null;
  userPermissions?: UserPermission[];
  createdAt: string;
  updatedAt: string;
}
