/** Auto-generated payload */
import type { Role } from '../enums/auth';

export interface UpdateAuthDto extends Partial<CreateAuthDto> {

}

export interface LoginDto {

  userName: string;

  password: string;

}

export interface GenerateKeyDto {

  packageId: string;

  serviceId: string;

  example: Role.ADMIN,
  description: 'Role mà người dùng sẽ nhận được sau khi kích hoạt',
  enum: Role,
  required: false,
  role?: Role;

  example: 30,
  required: false,
  days?: number;

  example: 'user@example.com',
  description: 'Địa chỉ email để gửi mã kích hoạt trực tiếp',
  required: false,
  mailto?: string;

}

export interface CreateAuthDto {

  userName: string;

  password: string;

  code?: string;

  serviceId?: string;

  invoiceCode?: string;

}

export interface ActivateDto {

  key: string;

  example: 'user_123',
  description: 'ID người dùng cần kích hoạt',
  userId: string;

}

