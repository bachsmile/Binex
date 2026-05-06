/** Auto-generated payload */
import type { UserStatus } from '../enums/user';
import type { Role } from '../enums/auth';

export interface UpdateUserDto extends Partial<CreateUserDto> {

  id: string;

  userName?: string;

  code?: string;

  fullName?: string;

  email?: string;

  phone?: string;

  address?: string;

  city?: string;

  state?: string;

  zip?: string;

  country?: string;

  role?: Role;

  status?: UserStatus;

  isDeleted?: boolean;

  deletedAt?: Date;

  deletedBy?: string;

  createdBy?: string;

  updatedBy?: string;

  managerIds?: string[];

  moduleRoles?: number[];

  walletIds?: string[];

  packageIds?: string[];

}

export interface UpdateUserRecordLimitDto {

  key: string;

  value: number;

}

export interface PermissionItem {

  serId?: string;

  serName: string;

  packId?: string;

  packName: string;

  example: 15,
  ac: number;

  expiredAt?: string;

}

export interface UpdatePermissionDto {

  type: [PermissionItem],
  description: 'Danh sách các quyền của người dùng',
  permissions: PermissionItem[];

}

export interface ExtendPermissionDto {

  days: number;

}

export interface CreateUserDto {

  userName: string;

  password: string;

  code?: string;

}

export interface ChangePackageDto {

  newPackageId: string;

}

