import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { CurrencyModule } from './features/currency/currency.module';
import { StockModule } from './features/stock/stock.module';
import { CryptoModule } from './features/crypto/crypto.module';
import { InvestmentModule } from './features/investment/investment.module';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService],
  imports: [CurrencyModule, StockModule, CryptoModule, InvestmentModule],
})
export class FinanceModule {}
