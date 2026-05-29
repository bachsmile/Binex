import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { generateSecret, generateURI, verifySync } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async generateTwoFactorSecret(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng');
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      label: user.email || user.userName,
      issuer: 'BINEX',
      secret,
    });

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    return {
      secret,
      qrCodeDataUrl,
    };
  }

  verifyTwoFactorToken(token: string, secret: string): boolean {
    const result = verifySync({ token, secret });
    return result?.valid === true;
  }

  async enableTwoFactor(userId: string, token: string, secret: string) {
    const isValid = this.verifyTwoFactorToken(token, secret);
    if (!isValid) {
      throw new BadRequestException('Mã xác thực không hợp lệ');
    }

    await this.userRepository.update(userId, {
      twoFactorSecret: secret,
      twoFactorEnabled: true,
    });

    return { message: 'Đã kích hoạt bảo mật 2FA thành công' };
  }

  async disableTwoFactor(userId: string, token: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException(
        '2FA chưa được kích hoạt cho tài khoản này',
      );
    }

    const isValid = this.verifyTwoFactorToken(token, user.twoFactorSecret);
    if (!isValid) {
      throw new BadRequestException('Mã xác thực không hợp lệ');
    }

    await this.userRepository.update(userId, {
      twoFactorSecret: null,
      twoFactorEnabled: false,
    });

    return { message: 'Đã hủy kích hoạt bảo mật 2FA thành công' };
  }
}
