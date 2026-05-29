import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { FiCryptoService } from './fi-crypto.service';
import { BuyTokenDto } from './dto/buy-token.dto';
import { SellTokenDto } from './dto/sell-token.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('fi-crypto')
@UseGuards(AuthGuard)
export class FiCryptoController {
  constructor(private readonly fiCryptoService: FiCryptoService) {}

  @Post('buy')
  buy(@CurrentUser('id') userId: string, @Body() dto: BuyTokenDto) {
    return this.fiCryptoService.buyToken(userId, dto);
  }

  @Post('sell')
  sell(@CurrentUser('id') userId: string, @Body() dto: SellTokenDto) {
    return this.fiCryptoService.sellToken(userId, dto);
  }

  @Get('balances')
  getBalances(@CurrentUser('id') userId: string) {
    return this.fiCryptoService.getCryptoBalances(userId);
  }

  @Get('history')
  getHistory(@CurrentUser('id') userId: string) {
    return this.fiCryptoService.getHistory(userId);
  }

  @Get('prices')
  getPrices() {
    return this.fiCryptoService.getTokenPrices();
  }

  @Get('average-price/:currency')
  getAveragePrice(
    @CurrentUser('id') userId: string,
    @Param('currency') currency: string,
  ) {
    return this.fiCryptoService.getAverageBuyPrice(userId, currency);
  }
}
