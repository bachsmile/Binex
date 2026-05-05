/** Auto-generated payload */
import type { Role } from '../enums/auth';

export interface UpdateAuthDto {

}

export interface LoginDto {
  userName: string;
  password: string;
}

export interface GenerateKeyDto {
  packageId: string;
  serviceId: string;
  role?: Role;
  required: false,
  days?: number;
  mailto?: string;
}

export interface CreateAuthDto {
  userName: string;
  password: string;
  code: string;
  serviceId: string;
  invoiceCode: string;
}

export interface ActivateDto {
  key: string;
  userId: string;
}

