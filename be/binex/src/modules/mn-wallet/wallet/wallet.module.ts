import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Currency } from './entities/currency.entity';
import { DepositRequest } from './entities/deposit-request.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Currency, DepositRequest]),
    AuthModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
