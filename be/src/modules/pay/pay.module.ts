import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { MethodPayModule } from './features/method/method-pay.module';
import { Payment } from './entities/payment.entity';
import { MethodPay } from './entities/method-pay.entity';
import { Order } from '../order/entities/order.entity';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { WalletModule } from '../wallet/wallet.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MethodPayModule,
    ConfigModule,
    TypeOrmModule.forFeature([Payment, MethodPay, Order]),
    MailModule,
    UserModule,
    WalletModule,
    AuthModule,
  ],
  controllers: [PayController],
  providers: [PayService],
  exports: [PayService],
})
export class PayModule {}
