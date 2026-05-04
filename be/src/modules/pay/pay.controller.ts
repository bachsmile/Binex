import { Controller, Post, Body, Get, Query, Patch } from '@nestjs/common';
import { PayService } from './pay.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CryptoPayDto } from './dto/pay/crypto-pay.dto';
import { ManualPayDto } from './dto/pay/manual-pay.dto';
import { PaymentRequestStatus } from './entities/payment-request.entity';

@ApiTags('pay')
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post('crypto')
  @ApiOperation({ summary: 'Thanh toán bằng Crypto qua mạng Plasma' })
  async payWithCrypto(@Body() cryptoPayDto: CryptoPayDto) {
    return this.payService.payWithPlasma(cryptoPayDto);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Kiểm tra số dư ví trên mạng Plasma' })
  async getBalance(@Query('address') address?: string) {
    const balance = await this.payService.getBalance(address);
    return { address, balance, symbol: 'ETH' };
  }

  @Get('admin-wallet')
  @ApiOperation({ summary: 'Lấy địa chỉ ví Super Admin để nhận thanh toán' })
  getAdminWallet() {
    const address = this.payService.getAdminWallet();
    return { address };
  }

  @Post('verify-payment')
  @ApiOperation({ summary: 'Xác minh giao dịch chuyển tiền từ người dùng' })
  async verifyPayment(
    @Query('txHash') txHash: string,
    @Query('amount') amount: number,
    @Query('orderId') orderId: string,
  ) {
    return this.payService.verifyPayment(txHash, amount, orderId);
  }

  @Post('manual')
  @ApiOperation({ summary: 'Gửi minh chứng thanh toán chuyển khoản' })
  async submitManualPayment(@Body() manualPayDto: ManualPayDto) {
    return this.payService.submitManualPayment(manualPayDto);
  }

  @Patch('manual/verify')
  @ApiOperation({ summary: 'Admin phê duyệt/từ chối thanh toán chuyển khoản' })
  async verifyManualPayment(
    @Query('requestId') requestId: string,
    @Query('status') status: PaymentRequestStatus,
    @Query('adminNote') adminNote?: string,
  ) {
    return this.payService.verifyManualPayment(requestId, status, adminNote);
  }

  @Get('manual/requests')
  @ApiOperation({ summary: 'Lấy danh sách yêu cầu thanh toán chuyển khoản' })
  async getPaymentRequests(@Query('status') status?: PaymentRequestStatus) {
    return this.payService.getPaymentRequests(status);
  }
}
