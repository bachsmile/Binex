import { Module } from '@nestjs/common';
import { MethodPayService } from './method-pay.service';
import { MethodPayController } from './method-pay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MethodPay } from './entities/method-pay.entity';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MethodPay]), AuthModule],
  controllers: [MethodPayController],
  providers: [MethodPayService],
  exports: [MethodPayService],
})

export class MethodPayModule {}
