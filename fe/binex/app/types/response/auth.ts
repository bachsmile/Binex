/** Auto-generated response */
import type { User } from './user';
import type { Role } from '../enums/auth';

export interface LoginResponse {

  accessToken: string;

  user: User;

  expiresIn: number;

}

export interface RegisterResponse {

  message: string;

  user: User;

}

export interface LogoutResponse {

  success: boolean;

}

export interface RedeemKeyResponse {

  message: string;

  packageName: string;

  newExpiredAt: string | Date;

  roleUpdated: boolean;

}

export interface Auth {

}

export interface ActivationKey {

  id: string;


  key: string;

  type: 'enum',
  enum: Role,
  nullable: true,
  role?: Role;

  days?: number;

  packageId: string;

  serviceId: string;

  isUsed: boolean;

  usedBy: string;

  expiresAt: Date;

  createdAt: Date;

}

