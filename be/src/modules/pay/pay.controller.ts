import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PayService } from './pay.service';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CryptoPayDto } from './dto/pay/crypto-pay.dto';
import { ManualPayDto } from './dto/pay/manual-pay.dto';
import { PayPackageDto } from './dto/pay/pay-package.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import {
  Payment,
  PaymentRequestStatus,
} from './entities/payment.entity';
import {
  CryptoPayResponse,
  BalanceResponse,
  VerifyPaymentResponse,
  PaymentRequestListResponse,
} from './responses/pay.response';

@ApiTags('pay')
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post('crypto')
  @ApiOperation({ summary: 'Thanh toán bằng Crypto qua mạng Plasma' })
  @ApiResponse({ status: 200, type: CryptoPayResponse })
  async payWithCrypto(@Body() cryptoPayDto: CryptoPayDto) {
    return this.payService.payWithPlasma(cryptoPayDto);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Kiểm tra số dư ví trên mạng Plasma' })
  @ApiResponse({ status: 200, type: BalanceResponse })
  async getBalance(@Query('address') address?: string) {
    const balance = await this.payService.getBalance(address);
    return { address, balance, symbol: 'ETH' };
  }

  @Post('verify-payment')
  @ApiOperation({ summary: 'Xác minh giao dịch chuyển tiền từ người dùng' })
  @ApiResponse({ status: 200, type: VerifyPaymentResponse })
  async verifyPayment(
    @Query('txHash') txHash: string,
    @Query('amount') amount: number,
    @Query('orderId') orderId: string,
  ) {
    return this.payService.verifyPayment(txHash, amount, orderId);
  }

  @Post('manual')
  @ApiOperation({ summary: 'Gửi minh chứng thanh toán chuyển khoản' })
  @ApiResponse({ status: 201, type: Payment })
  async submitManualPayment(@Body() manualPayDto: ManualPayDto) {
    return this.payService.submitManualPayment(manualPayDto);
  }

  @Patch('manual/verify')
  @ApiOperation({ summary: 'Admin phê duyệt/từ chối thanh toán chuyển khoản' })
  @ApiResponse({ status: 200, type: Payment })
  async verifyManualPayment(
    @Query('requestId') requestId: string,
    @Query('status') status: PaymentRequestStatus,
    @Query('adminNote') adminNote?: string,
  ) {
    return this.payService.verifyManualPayment(requestId, status, adminNote);
  }

  @Get('manual/requests')
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu thanh toán chuyển khoản' })
  @ApiResponse({ status: 200, type: PaymentRequestListResponse })
  async getPaymentRequests(
    @Query('status') status?: PaymentRequestStatus,
    @Query('serviceId') serviceId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.payService.getPaymentRequests(
      status,
      serviceId,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Post('package')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Thanh toán mua gói bằng Ví' })
  async payWalletPackage(
    @CurrentUser() user: any,
    @Body() payPackageDto: PayPackageDto,
  ) {
    return this.payService.payWalletPackage(payPackageDto, user?.id);
  }
}
