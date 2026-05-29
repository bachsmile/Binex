import { Module } from '@nestjs/common';
import { FiMoneyService } from './fi-money.service';
import { FiMoneyController } from './fi-money.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiMoney } from './entities/fi-money.entity';
import { Wallet } from 'src/modules/mn-wallet/wallet/entities/wallet.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FiMoney, Wallet]), AuthModule],
  controllers: [FiMoneyController],
  providers: [FiMoneyService],
})
export class FiMoneyModule {}
