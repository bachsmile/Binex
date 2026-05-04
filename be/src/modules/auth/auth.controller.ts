import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { GenerateKeyDto } from './dto/generate-key.dto';
import { ActivateDto } from './dto/activate.dto';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto, @Headers('x-role') xRole: string) {
    return this.authService.login(loginDto, xRole);
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('register-ad')
  @ApiOperation({ summary: 'Đăng ký tài khoản admin mới' })
  registerAd(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createAd(createAuthDto);
  }

  @Post('generate-key')
  @ApiOperation({ summary: 'Tạo mã kích hoạt mới (Admin dùng)' })
  generateKey(@Body() generateKeyDto: GenerateKeyDto) {
    return this.authService.generateActivationKey(
      generateKeyDto.packageId,
      generateKeyDto.serviceId,
      generateKeyDto.role,
      generateKeyDto.days,
    );
  }

  @Post('activate')
  @ApiOperation({ summary: 'Kích hoạt/Gia hạn tài khoản bằng mã' })
  activate(@Body() activateDto: ActivateDto) {
    return this.authService.redeemActivationKey(
      activateDto.userId,
      activateDto.key,
    );
  }

  @Get('key-info/:key')
  @ApiOperation({ summary: 'Xem thông tin của mã kích hoạt' })
  getKeyInfo(@Param('key') key: string) {
    return this.authService.getKeyInfo(key);
  }
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
