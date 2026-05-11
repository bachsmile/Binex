/** Auto-generated payload */
import type { UserStatus } from '../enums/user';
import type { CreateUserDto } from './create-user';
import type { Role } from '../enums/role';

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

