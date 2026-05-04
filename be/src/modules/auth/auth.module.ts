import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ActivationKey } from './entities/activation-key.entity';
import { Package } from '../service/entities/package.entity';
import { UserPermission } from '../user/entities/user-permission.entity';
import { Service } from '../service/entities/service.entity';
import { MailModule } from '../mail/mail.module';
import { forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MailModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([
      User,
      ActivationKey,
      Package,
      UserPermission,
      Service,
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
