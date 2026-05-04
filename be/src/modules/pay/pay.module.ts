import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { MethodPayModule } from './features/method/method-pay.module';
import { PaymentRequest } from './entities/payment-request.entity';
import { MethodPay } from './entities/method-pay.entity';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MethodPayModule,
    ConfigModule,
    TypeOrmModule.forFeature([PaymentRequest, MethodPay]),
    MailModule,
    UserModule,
  ],
  controllers: [PayController],
  providers: [PayService],
  exports: [PayService],
})
export class PayModule {}
