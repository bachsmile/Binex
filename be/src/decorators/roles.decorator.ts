import { SetMetadata } from '@nestjs/common';

export enum Role {
  USER = 'us',
  ADMIN = 'ad',
  MODERATOR = 'mo',
  MANAGER = 'ma',
  SUPER_ADMIN = 'sp-ad',
}

export const ROLES_KEY = 'roles';

/**
 * Decorator khai báo các role được phép truy cập route.
 * Sử dụng: @Roles(Role.ADMIN, Role.MODERATOR) trước controller method.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
