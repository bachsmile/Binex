import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { CryptoPayDto } from './dto/pay/crypto-pay.dto';
import { ManualPayDto } from './dto/pay/manual-pay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaymentRequest,
  PaymentRequestStatus,
} from './entities/payment-request.entity';
import { MethodPay } from './entities/method-pay.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { OrderType } from './enums/order-type.enum';

@Injectable()
export class PayService {
  private readonly logger = new Logger(PayService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(
    private configService: ConfigService,
    @InjectRepository(PaymentRequest)
    private readonly paymentRequestRepository: Repository<PaymentRequest>,
    @InjectRepository(MethodPay)
    private readonly methodPayRepository: Repository<MethodPay>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {
    const rpcUrl =
      this.configService.get<string>('PLASMA_RPC_URL') ||
      'https://rpc-plasma.binex.com'; // Placeholder
    const privateKey = this.configService.get<string>('PLASMA_PRIVATE_KEY');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    if (privateKey) {
      try {
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.logger.log('Plasma Payment Service initialized with wallet.');
      } catch (error) {
        this.logger.error(
          `Failed to initialize wallet: Invalid private key format. ${error.message}`,
        );
        this.logger.warn('Service will run in read-only mode.');
      }
    } else {
      this.logger.warn('Plasma Private Key not found. Read-only mode active.');
    }
  }

  /**
   * Thực hiện thanh toán qua mạng Plasma
   */
  async payWithPlasma(cryptoPayDto: CryptoPayDto) {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not initialized. Missing private key.');
      }

      const { toAddress, amount, orderId } = cryptoPayDto;
      const targetAddress = toAddress || this.getAdminWallet();

      this.logger.log(
        `Processing Plasma payment for order ${orderId}: ${amount} tokens to ${targetAddress}`,
      );

      // Chuyển đổi số lượng sang wei
      const value = ethers.parseEther(amount.toString());

      // Tạo transaction
      const tx = await this.wallet.sendTransaction({
        to: targetAddress,
        value: value,
      });

      this.logger.log(`Transaction sent: ${tx.hash}`);

      // Chờ xác nhận (ví dụ 1 block cho Plasma)
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error('Transaction sent but receipt not found.');
      }

      return {
        success: true,
        transactionHash: receipt.hash,
        orderId: orderId,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      this.logger.error(`Plasma payment failed: ${error.message}`);
      return {
        success: false,
        message: error.message,
        orderId: cryptoPayDto.orderId,
      };
    }
  }

  /**
   * Kiểm tra số dư ví
   */
  async getBalance(address?: string) {
    const targetAddress = address || (this.wallet ? this.wallet.address : null);
    if (!targetAddress) {
      throw new Error('No address provided and wallet not initialized.');
    }

    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  /**
   * Lấy địa chỉ ví của Super Admin để nhận thanh toán
   */
  getAdminWallet() {
    const adminWallet = this.configService.get<string>(
      'SUPER_ADMIN_WALLET_ADDRESS',
    );
    if (!adminWallet) {
      this.logger.error('SUPER_ADMIN_WALLET_ADDRESS not found in config.');
      throw new Error('Admin wallet address not configured.');
    }
    return adminWallet;
  }

  /**
   * Xác minh giao dịch từ phía người dùng
   * @param txHash Mã hash giao dịch từ frontend
   * @param expectedAmount Số tiền mong đợi (để kiểm tra)
   * @param orderId Mã đơn hàng để log/update
   */
  async verifyPayment(txHash: string, expectedAmount: number, orderId: string) {
    try {
      this.logger.log(`Verifying payment for order ${orderId}: ${txHash}`);

      // 1. Lấy thông tin transaction receipt
      const receipt = await this.provider.getTransactionReceipt(txHash);

      if (!receipt) {
        return {
          success: false,
          status: 'pending',
          message: 'Giao dịch chưa được tìm thấy hoặc đang chờ xác nhận.',
        };
      }

      // 2. Kiểm tra trạng thái giao dịch (1 là thành công)
      if (receipt.status !== 1) {
        return {
          success: false,
          status: 'failed',
          message: 'Giao dịch thất bại trên blockchain.',
        };
      }

      // 3. Lấy thông tin chi tiết transaction để kiểm tra người nhận và số tiền
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) {
        return {
          success: false,
          message: 'Không thể truy vấn thông tin chi tiết giao dịch.',
        };
      }

      const adminWallet = this.getAdminWallet().toLowerCase();
      const actualTo = tx.to?.toLowerCase();
      const actualValue = ethers.formatEther(tx.value);

      // Kiểm tra xem có gửi đúng ví admin không
      if (actualTo !== adminWallet) {
        return {
          success: false,
          message: 'Giao dịch không gửi đến ví của hệ thống.',
        };
      }

      // Kiểm tra số tiền (cho phép sai số nhỏ do làm tròn nếu cần, ở đây kiểm tra khớp)
      if (parseFloat(actualValue) < expectedAmount) {
        return {
          success: false,
          message: `Số tiền không đủ. Mong đợi: ${expectedAmount}, Thực nhận: ${actualValue}`,
        };
      }

      this.logger.log(`Payment verified successfully for order ${orderId}`);

      // Tại đây bạn có thể thêm logic unlock dịch vụ (ví dụ: update database)
      // await this.userService.unlockService(orderId);

      return {
        success: true,
        status: 'completed',
        transactionHash: txHash,
        from: tx.from,
        amount: actualValue,
      };
    } catch (error) {
      this.logger.error(`Verification error: ${error.message}`);
      return {
        success: false,
        message: 'Lỗi trong quá trình xác minh giao dịch.',
      };
    }
  }

  /**
   * Người dùng gửi minh chứng thanh toán chuyển khoản
   */
  async submitManualPayment(manualPayDto: ManualPayDto, userId?: string) {
    if (!manualPayDto.methodPayId) {
      throw new BadRequestException('ID phương thức thanh toán là bắt buộc.');
    }

    const methodPay = await this.methodPayRepository.findOne({
      where: { id: manualPayDto.methodPayId },
    });

    if (!methodPay) {
      throw new BadRequestException('Phương thức thanh toán không tồn tại.');
    }

    this.logger.log(
      `New manual payment submission for type: ${manualPayDto.orderType} (PK: ${manualPayDto.packageId}, SER: ${manualPayDto.serviceId})`,
    );
    const newRequest = this.paymentRequestRepository.create({
      ...manualPayDto,
      userId,
      status: PaymentRequestStatus.PENDING,
    });
    return await this.paymentRequestRepository.save(newRequest);
  }

  /**
   * Admin phê duyệt hoặc từ chối giao dịch chuyển khoản
   */
  async verifyManualPayment(
    requestId: string,
    status: PaymentRequestStatus,
    adminNote?: string,
  ) {
    const request = await this.paymentRequestRepository.findOne({
      where: { id: requestId },
    });
    if (!request) {
      throw new Error('Payment request not found');
    }

    request.status = status;
    request.adminNote = adminNote;
    request.updatedAt = new Date();

    const savedRequest = await this.paymentRequestRepository.save(request);

    if (status === PaymentRequestStatus.APPROVED) {
      this.logger.log(
        `Payment request ${requestId} APPROVED. Unlocking service...`,
      );
      // Logic unlock dịch vụ tại đây
      if (request.orderType === OrderType.CR_AC_ADMIN && request.userId) {
        const user = await this.userService.activateUser(request.userId);
        if (user) {
          this.logger.log(
            `User ${user.userName} activated via CR_AC_ADMIN order.`,
          );
          // Gửi mail thông báo
          await this.mailService.sendAccountActivatedEmail(
            user.email,
            user.userName,
          );
        }
      }

      // Logic gia hạn gói (RN_AC_PK)
      if (request.orderType === OrderType.RN_AC_PK && request.userId) {
        const permission = await this.userService.findLatestPermissionByUserId(
          request.userId,
        );
        const user = await this.userService.findOne(request.userId);

        if (permission && user) {
          let daysToExtend = 30; // Mặc định 30 ngày

          if (request.packageId) {
            const pkg = await this.userService.findPackageById(
              request.packageId,
            );
            if (pkg && pkg.expire) {
              daysToExtend = pkg.expire;
            }
          }

          const updatedPermission = await this.userService.extendPermission(
            permission.id,
            daysToExtend,
          );

          // Gửi mail thông báo gia hạn
          await this.mailService.sendPermissionExtendedEmail(
            user.email,
            user.userName,
            updatedPermission.expiredAt,
          );

          this.logger.log(
            `Permission for user ${user.userName} extended by ${daysToExtend} days.`,
          );
        }
      }
    }

    return savedRequest;
  }

  /**
   * Lấy danh sách yêu cầu thanh toán (cho Admin)
   */
  async getPaymentRequests(
    status?: PaymentRequestStatus,
    page: number = 1,
    limit: number = 10,
  ) {
    const [data, total] = await this.paymentRequestRepository.findAndCount({
      where: status ? { status } : {},
      relations: ['methodPay'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }
}
