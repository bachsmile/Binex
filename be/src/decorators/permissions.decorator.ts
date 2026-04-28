import { SetMetadata } from '@nestjs/common';

export interface RequiredPermission {
  service: string;
  action: number;
}

export const PERMISSIONS_KEY = 'permissions';
export const CheckPermissions = (service: string, action: number) =>
  SetMetadata(PERMISSIONS_KEY, { service, action });
