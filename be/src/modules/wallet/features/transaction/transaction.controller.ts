import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@ApiTags('transaction')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('my')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch của tôi' })
  findMyTransactions(@CurrentUser() user: any) {
    return this.transactionService.findAllByUserId(user.id);
  }

  @Get('address/:address')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch theo địa chỉ ví' })
  findByAddress(@Param('address') address: string) {
    return this.transactionService.findAllByAddress(address);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết giao dịch' })
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }
}
