import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class LoginResponse {
  @ApiProperty({ description: 'JWT Access Token' })
  accessToken: string;

  @ApiProperty({ description: 'Thông tin người dùng', type: () => User })
  user: User;

  @ApiProperty({ description: 'Thời gian hết hạn (giây)' })
  expiresIn: number;
}

export class RegisterResponse {
  @ApiProperty({ description: 'Thông báo kết quả' })
  message: string;

  @ApiProperty({ description: 'Thông tin người dùng vừa tạo' })
  user: User;
}

export class LogoutResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

export class RedeemKeyResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  packageName: string;

  @ApiProperty()
  newExpiredAt: string | Date;

  @ApiProperty()
  roleUpdated: boolean;
}
