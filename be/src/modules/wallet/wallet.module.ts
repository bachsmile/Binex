import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { AuthModule } from '../auth/auth.module';
import { TransactionModule } from './features/transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), AuthModule, TransactionModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
