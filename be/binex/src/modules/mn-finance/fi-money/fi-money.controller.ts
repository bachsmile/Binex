import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FiMoneyService } from './fi-money.service';
import { DepositToFinanceDto } from './dto/deposit-to-finance.dto';
import { WithdrawFromFinanceDto } from './dto/withdraw-from-finance.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('fi-money')
@UseGuards(AuthGuard)
export class FiMoneyController {
  constructor(private readonly fiMoneyService: FiMoneyService) {}
  @Post('deposit')
  deposit(@CurrentUser('id') userId: string, @Body() dto: DepositToFinanceDto) {
    return this.fiMoneyService.deposit(userId, dto);
  }

  @Post('withdraw')
  withdraw(
    @CurrentUser('id') userId: string,
    @Body() dto: WithdrawFromFinanceDto,
  ) {
    return this.fiMoneyService.withdraw(userId, dto);
  }
  @Get('balance')
  getBalance(@CurrentUser('id') userId: string) {
    return this.fiMoneyService.getFinanceBalance(userId);
  }

  @Get('history')
  getHistory(@CurrentUser('id') userId: string) {
    return this.fiMoneyService.getHistory(userId);
  }
}
