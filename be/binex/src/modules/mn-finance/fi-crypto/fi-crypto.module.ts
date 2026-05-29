import { Module } from '@nestjs/common';
import { FiCryptoService } from './fi-crypto.service';
import { FiCryptoController } from './fi-crypto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiCrypto } from './entities/fi-crypto.entity';
import { FiMoney } from '../fi-money/entities/fi-money.entity';
import { Wallet } from 'src/modules/mn-wallet/wallet/entities/wallet.entity';
import { AuthModule } from 'src/modules/mn-user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FiCrypto, FiMoney, Wallet]), AuthModule],
  controllers: [FiCryptoController],
  providers: [FiCryptoService],
})
export class FiCryptoModule {}
