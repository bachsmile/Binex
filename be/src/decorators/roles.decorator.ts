import { SetMetadata } from '@nestjs/common';
import { Role } from '../modules/auth/enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator khai báo các role được phép truy cập route.
 * Sử dụng: @Roles(Role.ADMIN, Role.MODERATOR) trước controller method.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
