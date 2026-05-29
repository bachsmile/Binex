import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('auth-2fa')
@ApiBearerAuth('JWT-auth')
@Controller('auth/2fa')
@UseGuards(AuthGuard)
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Tạo mã bí mật và QR Code 2FA' })
  async generate(@CurrentUser() user: any) {
    return this.twoFactorAuthService.generateTwoFactorSecret(user.id);
  }

  @Post('enable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Kích hoạt bảo mật 2FA' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: '123456',
          description: 'Mã OTP từ app Authenticator',
        },
        secret: {
          type: 'string',
          example: 'SECRET_BASE32',
          description: 'Mã bí mật tạm thời',
        },
      },
      required: ['token', 'secret'],
    },
  })
  async enable(
    @CurrentUser() user: any,
    @Body('token') token: string,
    @Body('secret') secret: string,
  ) {
    return this.twoFactorAuthService.enableTwoFactor(user.id, token, secret);
  }

  @Post('disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Hủy kích hoạt bảo mật 2FA' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: '123456',
          description: 'Mã OTP từ app Authenticator',
        },
      },
      required: ['token'],
    },
  })
  async disable(@CurrentUser() user: any, @Body('token') token: string) {
    return this.twoFactorAuthService.disableTwoFactor(user.id, token);
  }
}
