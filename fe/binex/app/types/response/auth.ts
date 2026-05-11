/** Auto-generated response */
import type { User } from './user';

export interface LoginResponse {

  /**
   * JWT Access Token
   */
  accessToken: string;

  /**
   * Thông tin người dùng
   */
  user: User;

  /**
   * Thời gian hết hạn (giây)
   */
  expiresIn: number;

}

export interface RegisterResponse {

  /**
   * Thông báo kết quả
   */
  message: string;

  /**
   * Thông tin người dùng vừa tạo
   */
  user: User;

}

export interface LogoutResponse {

  /**
   * example: true
   */
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

