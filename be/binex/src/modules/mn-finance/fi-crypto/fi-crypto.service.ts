import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FiCrypto } from './entities/fi-crypto.entity';
import { FiMoney } from '../fi-money/entities/fi-money.entity';
import { Wallet } from 'src/modules/mn-wallet/wallet/entities/wallet.entity';
import { BuyTokenDto } from './dto/buy-token.dto';
import { SellTokenDto } from './dto/sell-token.dto';
import { FiStatusTransaction, FiTransactionType } from '../enum/index.enum';

@Injectable()
export class FiCryptoService {
  constructor(
    @InjectRepository(FiCrypto)
    private readonly fiCryptoRepository: Repository<FiCrypto>,
    @InjectRepository(FiMoney)
    private readonly fiMoneyRepository: Repository<FiMoney>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async buyToken(userId: string, dto: BuyTokenDto) {
    return await this.fiCryptoRepository.manager.transaction(
      async (manager) => {
        const cost = dto.quantity * dto.price;

        // 1. Kiểm tra số dư tài khoản đầu tư (FiMoney) của paymentCurrency
        const moneyRecords = await manager.find(FiMoney, {
          where: {
            userId,
            status: FiStatusTransaction.SUCCESS,
            currency: dto.paymentCurrency,
          },
        });

        let moneyBalance = 0;
        for (const record of moneyRecords) {
          const amount = Number(record.amount) || 0;
          if (
            record.type === FiTransactionType.DEPOSIT ||
            record.type === FiTransactionType.SELL
          ) {
            moneyBalance += amount;
          } else if (
            record.type === FiTransactionType.WITHDRAW ||
            record.type === FiTransactionType.BUY
          ) {
            moneyBalance -= amount;
          }
        }

        if (moneyBalance < cost) {
          throw new BadRequestException(
            `Số dư tài khoản đầu tư không đủ để mua token. Cần: ${cost} ${dto.paymentCurrency.toUpperCase()}, Hiện tại: ${moneyBalance} ${dto.paymentCurrency.toUpperCase()}`,
          );
        }

        // Tìm walletId để lưu log FiMoney
        const wallet = await manager.findOne(Wallet, { where: { userId } });
        const walletId = wallet ? wallet.id : '';

        // 2. Tạo log trừ tiền ở bảng FiMoney
        const fiMoney = manager.create(FiMoney, {
          userId,
          walletId,
          amount: cost,
          currency: dto.paymentCurrency,
          type: FiTransactionType.BUY,
          status: FiStatusTransaction.SUCCESS,
          description: `Mua ${dto.quantity} ${dto.currency.toUpperCase()} với giá ${dto.price} ${dto.paymentCurrency.toUpperCase()}/token`,
        });
        await manager.save(FiMoney, fiMoney);

        // 3. Tạo log cộng crypto ở bảng FiCrypto
        const fiCrypto = manager.create(FiCrypto, {
          userId,
          quantity: dto.quantity,
          currency: dto.currency,
          type: FiTransactionType.BUY,
          status: FiStatusTransaction.SUCCESS,
          initPrice: dto.price,
          value: cost,
        });
        await manager.save(FiCrypto, fiCrypto);

        return {
          success: true,
          message: 'Mua token thành công',
          transactionId: fiCrypto.id,
        };
      },
    );
  }

  async sellToken(userId: string, dto: SellTokenDto) {
    return await this.fiCryptoRepository.manager.transaction(
      async (manager) => {
        const revenue = dto.quantity * dto.price;

        // 1. Kiểm tra số dư token hiện tại (FiCrypto)
        const cryptoRecords = await manager.find(FiCrypto, {
          where: {
            userId,
            status: FiStatusTransaction.SUCCESS,
            currency: dto.currency,
          },
        });

        let tokenBalance = 0;
        for (const record of cryptoRecords) {
          const qty = Number(record.quantity) || 0;
          if (record.type === FiTransactionType.BUY) {
            tokenBalance += qty;
          } else if (record.type === FiTransactionType.SELL) {
            tokenBalance -= qty;
          }
        }

        if (tokenBalance < dto.quantity) {
          throw new BadRequestException(
            `Số dư token không đủ để thực hiện giao dịch bán. Cần: ${dto.quantity} ${dto.currency.toUpperCase()}, Hiện tại: ${tokenBalance} ${dto.currency.toUpperCase()}`,
          );
        }

        // 2. Tạo log trừ crypto ở bảng FiCrypto (Type: SELL)
        const fiCrypto = manager.create(FiCrypto, {
          userId,
          quantity: dto.quantity,
          currency: dto.currency,
          type: FiTransactionType.SELL,
          status: FiStatusTransaction.SUCCESS,
          initPrice: dto.price,
          value: revenue,
        });
        await manager.save(FiCrypto, fiCrypto);

        // Tìm walletId để lưu log FiMoney
        const wallet = await manager.findOne(Wallet, { where: { userId } });
        const walletId = wallet ? wallet.id : '';

        // 3. Tạo log cộng tiền ở bảng FiMoney
        const fiMoney = manager.create(FiMoney, {
          userId,
          walletId,
          amount: revenue,
          currency: dto.paymentCurrency,
          type: FiTransactionType.SELL,
          status: FiStatusTransaction.SUCCESS,
          description: `Bán ${dto.quantity} ${dto.currency.toUpperCase()} với giá ${dto.price} ${dto.paymentCurrency.toUpperCase()}/token`,
        });
        await manager.save(FiMoney, fiMoney);

        return {
          success: true,
          message: 'Bán token thành công',
          transactionId: fiCrypto.id,
        };
      },
    );
  }

  async getCryptoBalances(userId: string) {
    const records = await this.fiCryptoRepository.find({
      where: { userId, status: FiStatusTransaction.SUCCESS },
    });

    const balances: Record<string, number> = {};

    for (const record of records) {
      const currency = record.currency.toLowerCase();
      const qty = Number(record.quantity) || 0;

      if (!balances[currency]) {
        balances[currency] = 0;
      }

      if (record.type === FiTransactionType.BUY) {
        balances[currency] += qty;
      } else if (record.type === FiTransactionType.SELL) {
        balances[currency] -= qty;
      }
    }

    return balances;
  }

  async getHistory(userId: string) {
    return await this.fiCryptoRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAverageBuyPrice(userId: string, currency: string) {
    const normalizedCurrency = currency.toUpperCase();
    const records = await this.fiCryptoRepository.find({
      where: {
        userId,
        currency: normalizedCurrency as any,
        status: FiStatusTransaction.SUCCESS,
      },
      order: { createdAt: 'ASC' },
    });

    let remainingQty = 0;
    let remainingSellQty = 0;
    let totalBuyValue = 0;
    let totalSellValue = 0;

    for (const record of records) {
      const val = Number(record.value) || 0;
      const qty = Number(record.quantity) || 0;
      remainingQty += qty;
      if (record.type === FiTransactionType.BUY) {
        totalBuyValue += val;
      } else if (record.type === FiTransactionType.SELL) {
        totalSellValue += val;
        remainingSellQty += qty;
      }
    }

    const averageBuyPrice = totalBuyValue / remainingQty;
    const pnl = totalSellValue - remainingSellQty * averageBuyPrice;
    return {
      currency: normalizedCurrency,
      remainingQty,
      totalBuyValue,
      totalSellValue,
      averageBuyPrice,
      pnl,
    };
  }

  async getTokenPrices() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether,bitcoin,ethereum&vs_currencies=vnd',
      );
      if (!response.ok) {
        throw new Error('Failed to fetch from CoinGecko');
      }
      const data = await response.json();

      return {
        usdt_vnd: data.tether?.vnd || 25400,
        btc_vnd: data.bitcoin?.vnd || 1720000000,
        eth_vnd: data.ethereum?.vnd || 90000000,
        source: 'coingecko',
      };
    } catch {
      return {
        usdt_vnd: 25420,
        btc_vnd: 1725000000,
        eth_vnd: 90200000,
        source: 'fallback',
      };
    }
  }
}
