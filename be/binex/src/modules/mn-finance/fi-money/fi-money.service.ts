import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FiMoney } from './entities/fi-money.entity';
import { DepositToFinanceDto } from './dto/deposit-to-finance.dto';
import { WithdrawFromFinanceDto } from './dto/withdraw-from-finance.dto';
import { Wallet } from 'src/modules/mn-wallet/wallet/entities/wallet.entity';
import { Currency } from 'src/modules/mn-wallet/wallet/entities/currency.entity';
import { CurrencyType } from 'src/constants/enum/currency.enum';
import { TwoFactorAuthService } from 'src/modules/mn-user/auth/two-factor-auth.service';
import { Transaction } from 'src/modules/mn-wallet/transaction/entities/transaction.entity';
import {
  MethodTranslateEnum,
  StatusTranslateEnum,
  TypeTranslateEnum,
} from 'src/modules/mn-wallet/transaction/enum/type-translate.enum';
import { FiStatusTransaction, FiTransactionType } from '../enum/index.enum';

@Injectable()
export class FiMoneyService {
  constructor(
    @InjectRepository(FiMoney)
    private readonly fiMoneyRepository: Repository<FiMoney>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  async deposit(userId: string, dto: DepositToFinanceDto) {
    return await this.fiMoneyRepository.manager.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, {
        where: { address: dto.walletAddress, userId },
        relations: ['user', 'balances'],
      });

      if (!wallet) {
        throw new BadRequestException(
          'Ví không tồn tại hoặc không thuộc sở hữu của bạn',
        );
      }

      if (
        !wallet.user ||
        !wallet.user.twoFactorEnabled ||
        !wallet.user.twoFactorSecret
      ) {
        throw new BadRequestException(
          'Vui lòng kích hoạt 2FA trước khi giao dịch',
        );
      }

      const isValid2FA = this.twoFactorAuthService.verifyTwoFactorToken(
        dto.twoFactorToken,
        wallet.user.twoFactorSecret,
      );
      if (!isValid2FA) {
        throw new BadRequestException('Mã xác thực 2FA không chính xác');
      }

      // Xác định loại tiền
      const normalizedCurrency = dto.currency.toUpperCase();
      let dbCurrency: CurrencyType;
      if (normalizedCurrency === 'VND' || normalizedCurrency === 'VNĐ') {
        dbCurrency = CurrencyType.VND;
      } else if (
        normalizedCurrency === 'USDT' ||
        normalizedCurrency === 'USD'
      ) {
        dbCurrency = CurrencyType.USDT;
      } else {
        dbCurrency = normalizedCurrency as CurrencyType;
      }

      // Kiểm tra số dư ví
      const balanceRecord = wallet.balances?.find(
        (c) => c.currency === dbCurrency,
      );
      if (!balanceRecord || Number(balanceRecord.balance) < dto.amount) {
        throw new BadRequestException(
          'Số dư ví không đủ để thực hiện giao dịch',
        );
      }

      // 1. Trừ tiền trong ví wallet
      balanceRecord.balance = Number(balanceRecord.balance) - dto.amount;
      await manager.save(Currency, balanceRecord);

      // 2. Tạo lịch sử giao dịch wallet
      const transaction = manager.create(Transaction, {
        userId,
        walletId: wallet.id,
        amount: dto.amount,
        type: TypeTranslateEnum.WITHDRAW, // rút ra để nạp sang finance
        status: StatusTranslateEnum.COMPLETED,
        method: MethodTranslateEnum.WALLET,
        description:
          dto.description || 'Chuyển tiền vào tài khoản đầu tư (Finance)',
      });
      await manager.save(Transaction, transaction);

      // 3. Cộng tiền/Tạo log nạp tiền vào bảng fi_money
      const fiMoney = manager.create(FiMoney, {
        userId,
        walletId: wallet.id,
        amount: dto.amount,
        currency: dbCurrency,
        type: FiTransactionType.DEPOSIT,
        status: FiStatusTransaction.SUCCESS,
        description: dto.description || 'Nạp tiền đầu tư từ ví wallet',
      });
      await manager.save(FiMoney, fiMoney);

      return {
        success: true,
        message: 'Nạp tiền vào tài khoản đầu tư thành công',
        transactionId: fiMoney.id,
      };
    });
  }

  async withdraw(userId: string, dto: WithdrawFromFinanceDto) {
    return await this.fiMoneyRepository.manager.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, {
        where: { address: dto.walletAddress, userId },
        relations: ['user', 'balances'],
      });

      if (!wallet) {
        throw new BadRequestException(
          'Ví không tồn tại hoặc không thuộc sở hữu của bạn',
        );
      }

      if (
        !wallet.user ||
        !wallet.user.twoFactorEnabled ||
        !wallet.user.twoFactorSecret
      ) {
        throw new BadRequestException(
          'Vui lòng kích hoạt 2FA trước khi giao dịch',
        );
      }

      const isValid2FA = this.twoFactorAuthService.verifyTwoFactorToken(
        dto.twoFactorToken,
        wallet.user.twoFactorSecret,
      );
      if (!isValid2FA) {
        throw new BadRequestException('Mã xác thực 2FA không chính xác');
      }

      // Xác định loại tiền
      const normalizedCurrency = dto.currency.toUpperCase();
      let dbCurrency: CurrencyType;
      if (normalizedCurrency === 'VND' || normalizedCurrency === 'VNĐ') {
        dbCurrency = CurrencyType.VND;
      } else if (
        normalizedCurrency === 'USDT' ||
        normalizedCurrency === 'USD'
      ) {
        dbCurrency = CurrencyType.USDT;
      } else {
        dbCurrency = normalizedCurrency as CurrencyType;
      }

      // Tính toán số dư tài khoản đầu tư hiện tại
      const records = await manager.find(FiMoney, {
        where: { userId, status: FiStatusTransaction.SUCCESS },
      });

      let currentBalance = 0;
      for (const record of records) {
        const amount = Number(record.amount) || 0;
        if (record.currency === dbCurrency) {
          if (record.type === FiTransactionType.DEPOSIT) {
            currentBalance += amount;
          } else if (record.type === FiTransactionType.WITHDRAW) {
            currentBalance -= amount;
          }
        }
      }

      if (currentBalance < dto.amount) {
        throw new BadRequestException(
          'Số dư tài khoản đầu tư không đủ để thực hiện giao dịch rút tiền',
        );
      }

      // 1. Cộng tiền vào ví wallet
      let balanceRecord = wallet.balances?.find(
        (c) => c.currency === dbCurrency,
      );
      if (!balanceRecord) {
        balanceRecord = manager.create(Currency, {
          userId,
          walletId: wallet.id,
          currency: dbCurrency,
          balance: 0,
        });
      }
      balanceRecord.balance = Number(balanceRecord.balance) + dto.amount;
      await manager.save(Currency, balanceRecord);

      // 2. Tạo lịch sử giao dịch wallet
      const transaction = manager.create(Transaction, {
        userId,
        walletId: wallet.id,
        amount: dto.amount,
        type: TypeTranslateEnum.DEPOSIT, // nạp tiền vào wallet từ finance
        status: StatusTranslateEnum.COMPLETED,
        method: MethodTranslateEnum.WALLET,
        description:
          dto.description || 'Rút tiền từ tài khoản đầu tư (Finance)',
      });
      await manager.save(Transaction, transaction);

      // 3. Trừ tiền/Tạo log rút tiền vào bảng fi_money
      const fiMoney = manager.create(FiMoney, {
        userId,
        walletId: wallet.id,
        amount: dto.amount,
        currency: dbCurrency,
        type: FiTransactionType.WITHDRAW,
        status: FiStatusTransaction.SUCCESS,
        description: dto.description || 'Rút tiền đầu tư về ví wallet',
      });
      await manager.save(FiMoney, fiMoney);

      return {
        success: true,
        message: 'Rút tiền từ tài khoản đầu tư thành công',
        transactionId: fiMoney.id,
      };
    });
  }

  async getFinanceBalance(userId: string) {
    const records = await this.fiMoneyRepository.find({
      where: { userId, status: FiStatusTransaction.SUCCESS },
    });

    let vnd = 0;
    let usdt = 0;

    for (const record of records) {
      const amount = Number(record.amount) || 0;
      if (record.type === FiTransactionType.DEPOSIT) {
        if (record.currency === CurrencyType.VND) vnd += amount;
        else if (record.currency === CurrencyType.USDT) usdt += amount;
      } else if (record.type === FiTransactionType.WITHDRAW) {
        if (record.currency === CurrencyType.VND) vnd -= amount;
        else if (record.currency === CurrencyType.USDT) usdt -= amount;
      }
    }

    return {
      vnd,
      usdt,
    };
  }

  async getHistory(userId: string) {
    return await this.fiMoneyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
