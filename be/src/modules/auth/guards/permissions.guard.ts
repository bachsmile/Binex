import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  RequiredPermission,
} from 'src/decorators/permissions.decorator';

import { Role } from 'src/decorators/roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.get<RequiredPermission>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 💡 SUPER_ADMIN có toàn quyền, không cần check chi tiết
    if (user && user.role === Role.SUPER_ADMIN) {
      return true;
    }

    const xRole = request.headers['x-role'];


    // 1. Kiểm tra x-role nếu cần thiết (ví dụ x-role phải khớp với role của user)
    if (xRole && user.role !== xRole) {
      throw new ForbiddenException(
        'Role trong x-role không khớp với tài khoản',
      );
    }

    // 2. Kiểm tra chi tiết permission (Binary)
    const userPermissions = user.userPermissions || [];

    // Tìm permission cho service tương ứng
    const permission = userPermissions.find((p) => p.ser === required.service);

    if (!permission) {
      throw new ForbiddenException(
        `Bạn không có quyền truy cập service: ${required.service}`,
      );
    }

    // Kiểm tra bằng toán tử bitwise &
    const hasAction = (permission.ac & required.action) === required.action;

    if (!hasAction) {
      throw new ForbiddenException(
        `Bạn không có quyền thực hiện hành động này trên service: ${required.service}`,
      );
    }

    return true;
  }
}
