import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { TransactionModule } from './features/transaction/transaction.module';
import { MethodPay } from '../pay/entities/method-pay.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, User, MethodPay]),
    AuthModule,
    TransactionModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
