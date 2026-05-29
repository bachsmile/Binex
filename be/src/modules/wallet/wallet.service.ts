import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { WORD_LIST } from './constants/wordlist';
import * as crypto from 'crypto';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from './entities/transaction.entity';
import { Role } from '../auth/enums/role.enum';
import { MethodPay } from '../pay/entities/method-pay.entity';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(MethodPay)
    private methodPayRepository: Repository<MethodPay>,
    private configService: ConfigService,
  ) { }

  async create(createWalletDto: CreateWalletDto, userId: string) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      const isAdminWallet = user?.role === Role.SUPER_ADMIN;

      // 0. Kiểm tra xem người dùng đã có ví chưa
      const userWallet = await manager.findOne(Wallet, {
        where: { userId },
      });

      let savedWallet: Wallet;

      if (userWallet) {
        // Nếu đã có ví, dùng ví đó để đồng bộ lại (phòng trường hợp User table bị null)
        savedWallet = userWallet;
        console.log(
          `[Wallet] User ${userId} already has wallet ${savedWallet.id}. Syncing...`,
        );
      } else {
        // 1. Kiểm tra xem Private Key hoặc Public Key đã tồn tại chưa
        const existingWallet = await manager.findOne(Wallet, {
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
          const checkAddress = await manager.findOne(Wallet, {
            where: { address },
          });
          if (!checkAddress) isAddressUnique = true;
        }

        // 3. Tạo ví mới
        const wallet = manager.create(Wallet, {
          ...createWalletDto,
          userId,
          address,
          isAdminWallet,
          createdBy: userId,
          updatedBy: userId,
        });

        savedWallet = await manager.save(wallet);
      }



      return savedWallet;
    });
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

  async findAllAdmin(page: number = 1, limit: number = 100) {
    const [data, total] = await this.walletRepository.findAndCount({
      where: { isAdminWallet: true },
      relations: ['user'],
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
    from: string | undefined,
    to: string,
    amount: number,
    currency: string,
    actorUserId: string,
    canUseAnyFromWallet: boolean,
  ) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      if (!amount || amount <= 0) {
        throw new BadRequestException('Số tiền chuyển phải lớn hơn 0');
      }
      if (!['VND', 'USD'].includes(currency)) {
        throw new BadRequestException('Loại tiền không hợp lệ');
      }

      // 1. Lấy ví người gửi
      const fromWallet = from
        ? await manager.findOne(Wallet, { where: { address: from } })
        : await manager.findOne(Wallet, { where: { userId: actorUserId } });
      if (!fromWallet) {
        throw new BadRequestException('Không tìm thấy ví người gửi');
      }

      if (!canUseAnyFromWallet && fromWallet.userId !== actorUserId) {
        throw new BadRequestException('Bạn không có quyền chuyển tiền từ ví này');
      }

      const fromBalance = fromWallet.balance[currency] || 0;
      if (fromBalance < amount) {
        throw new BadRequestException('Số dư không đủ');
      }

      // 2. Lấy ví người nhận qua address
      const toWallet = await manager.findOne(Wallet, {
        where: { address: to },
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
        userId: fromWallet.userId,
        description: `Chuyển ${amount} ${currency} tới ${to}`,
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

  async deposit(
    address: string,
    amount: number,
    currency: string,
    methodPayId?: string,
    description?: string,
    actorUserId?: string,
  ) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      if (!amount || amount <= 0) {
        throw new BadRequestException('Số tiền nạp phải lớn hơn 0');
      }
      if (!['VND', 'USD'].includes(currency)) {
        throw new BadRequestException('Loại tiền không hợp lệ');
      }

      const wallet = await manager.findOne(Wallet, { where: { address } });
      if (!wallet) {
        throw new BadRequestException('Không tìm thấy ví với địa chỉ này');
      }

      const methodPay = methodPayId
        ? await manager.findOne(MethodPay, { where: { id: methodPayId } })
        : null;
      if (methodPayId && !methodPay) {
        throw new BadRequestException('Không tìm thấy ngân hàng đã chọn');
      }

      const newBalance = { ...wallet.balance };
      newBalance[currency] = (newBalance[currency] || 0) + amount;

      wallet.balance = newBalance;
      await manager.save(wallet);

      const transactionDescription =
        description?.trim() ||
        `Nạp ${amount} ${currency} vào ví${methodPay ? ` qua ${methodPay.bankName || methodPay.name}` : ''
        }`;

      const transaction = manager.create(Transaction, {
        toAddress: address,
        amount,
        currency,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.SUCCESS,
        userId: wallet.userId,
        description: transactionDescription,
      });
      await manager.save(transaction);

      return {
        success: true,
        data: wallet,
        transactionId: transaction.id,
        methodPayId: methodPay?.id,
        createdBy: actorUserId,
      };
    });
  }

  async getAdminWallet() {
    const adminWallet = await this.walletRepository.findOne({
      where: { isAdminWallet: true },
      order: { createdAt: 'ASC' },
    });
    if (!adminWallet) {
      this.logger.error('No admin wallet found in the database.');
      throw new Error('Admin wallet address not configured in database.');
    }
    return adminWallet.address;
  }
}
