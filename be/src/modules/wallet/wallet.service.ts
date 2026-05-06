import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { WORD_LIST } from './constants/wordlist';
import * as crypto from 'crypto';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from './entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletDto, userId: string) {
    // 0. Kiểm tra xem người dùng đã có ví chưa
    const userWallet = await this.walletRepository.findOne({
      where: { userId },
    });

    if (userWallet) {
      throw new BadRequestException('Mỗi người dùng chỉ được phép sở hữu 1 ví');
    }

    // 1. Kiểm tra xem Private Key hoặc Public Key đã tồn tại chưa
    const existingWallet = await this.walletRepository.findOne({
      where: [
        { privateKey: createWalletDto.privateKey },
        { publicKey: createWalletDto.publicKey },
      ],
    });

    if (existingWallet) {
      throw new BadRequestException('Ví này đã tồn tại trong hệ thống');
    }

    const generateHash = (suffix: string) => {
      const prefix = '0xB';
      const randomLen = 52 - prefix.length - suffix.length;
      const randomPart = crypto
        .randomBytes(Math.ceil(randomLen / 2))
        .toString('hex')
        .slice(0, randomLen);
      return prefix + randomPart + suffix;
    };

    // 2. Đảm bảo address tạo ra là duy nhất
    let address = '';
    let isAddressUnique = false;
    while (!isAddressUnique) {
      address = generateHash('evn');
      const checkAddress = await this.walletRepository.findOne({
        where: { address },
      });
      if (!checkAddress) isAddressUnique = true;
    }

    const wallet = this.walletRepository.create({
      ...createWalletDto,
      userId,
      address,
      createdBy: userId,
      updatedBy: userId,
    });

    return this.walletRepository.save(wallet);
  }

  async createKey() {
    let privateKey = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomWords: string[] = [];
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
        randomWords.push(WORD_LIST[randomIndex]);
      }
      privateKey = randomWords.join(' ');

      const duplicate = await this.walletRepository.findOne({
        where: { privateKey },
      });
      if (!duplicate) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new BadRequestException(
        'Không thể tạo khóa duy nhất, vui lòng thử lại',
      );
    }

    return { privateKey };
  }

  validatePrivateKey(privateKey: string) {
    if (!privateKey) return '';
    const words = privateKey.trim().split(/\s+/);

    if (words.length !== 12) {
      throw new BadRequestException('Khóa không hợp lệ');
    }
    for (const word of words) {
      if (!WORD_LIST.includes(word)) {
        throw new BadRequestException('Khóa không hợp lệ');
      }
    }

    const publicKey = crypto
      .createHash('sha256')
      .update(privateKey)
      .digest('hex');

    return publicKey;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.walletRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findAllByUserId(userId: string, page: number = 1, limit: number = 10) {
    const [data, total] = await this.walletRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  findOne(id: string) {
    return this.walletRepository.findOne({ where: { id } });
  }

  update(id: string, updateWalletDto: UpdateWalletDto) {
    return this.walletRepository.update(id, updateWalletDto);
  }

  remove(id: string) {
    return this.walletRepository.delete(id);
  }

  async transfer(
    fromUserId: string,
    toAddress: string,
    amount: number,
    currency: string,
  ) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      // 1. Lấy ví người gửi
      const fromWallet = await manager.findOne(Wallet, {
        where: { userId: fromUserId },
      });
      if (!fromWallet) {
        throw new BadRequestException('Không tìm thấy ví người gửi');
      }

      const fromBalance = fromWallet.balance[currency] || 0;
      if (fromBalance < amount) {
        throw new BadRequestException('Số dư không đủ');
      }

      // 2. Lấy ví người nhận qua address
      const toWallet = await manager.findOne(Wallet, {
        where: { address: toAddress },
      });
      if (!toWallet) {
        throw new BadRequestException('Địa chỉ ví nhận không tồn tại');
      }

      // 3. Thực hiện chuyển tiền
      const newFromBalance = { ...fromWallet.balance };
      const newToBalance = { ...toWallet.balance };

      newFromBalance[currency] = fromBalance - amount;
      newToBalance[currency] = (newToBalance[currency] || 0) + amount;

      // Cập nhật lại đối tượng để TypeORM nhận biết sự thay đổi trong JSONB
      fromWallet.balance = newFromBalance;
      toWallet.balance = newToBalance;

      // 4. Lưu cả hai
      await manager.save(fromWallet);
      await manager.save(toWallet);

      // 5. Lưu lịch sử giao dịch (Transaction History)
      const transaction = manager.create(Transaction, {
        fromAddress: fromWallet.address,
        toAddress: toWallet.address,
        amount,
        currency,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.SUCCESS,
        userId: fromUserId,
        description: `Chuyển ${amount} ${currency} tới ${toAddress}`,
      });
      await manager.save(transaction);

      // Ghi thêm một bản ghi cho người nhận
      const receiverTransaction = manager.create(Transaction, {
        fromAddress: fromWallet.address,
        toAddress: toWallet.address,
        amount,
        currency,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.SUCCESS,
        userId: toWallet.userId,
        description: `Nhận ${amount} ${currency} từ ${fromWallet.address}`,
      });
      await manager.save(receiverTransaction);

      return {
        success: true,
        message: `Đã chuyển ${amount} ${currency} thành công`,
        transactionId: transaction.id,
      };
    });
  }

  async deposit(address: string, amount: number, currency: string) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, { where: { address } });
      if (!wallet) {
        throw new BadRequestException('Không tìm thấy ví với địa chỉ này');
      }

      const newBalance = { ...wallet.balance };
      newBalance[currency] = (newBalance[currency] || 0) + amount;

      wallet.balance = newBalance;
      await manager.save(wallet);

      // Lưu lịch sử nạp tiền
      const transaction = manager.create(Transaction, {
        toAddress: address,
        amount,
        currency,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.SUCCESS,
        userId: wallet.userId,
        description: `Nạp ${amount} ${currency} vào ví`,
      });
      await manager.save(transaction);

      return {
        success: true,
        data: wallet,
        transactionId: transaction.id,
      };
    });
  }
}
