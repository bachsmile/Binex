import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { TransferDto } from './dto/transfer.dto';
import { DepositFromAdminDto } from './dto/deposit-from-admin.dto';
import { WORD_LIST } from '../../../constants/wordlist';
import { generateHash } from '../../../common/utils/string.utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import * as crypto from 'crypto';
import { User } from 'src/modules/mn-user/user/entities/user.entity';
import { Role } from 'src/modules/mn-user/enum/role.enum';
import { DepositDto } from './dto/deposit.dto';
import { Banking } from '../banking/entities/banking.entity';
import { CurrencyType } from '../../../constants/enum/currency.enum';
import { Currency } from './entities/currency.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import {
  TypeTranslateEnum,
  StatusTranslateEnum,
  MethodTranslateEnum,
} from '../transaction/enum/type-translate.enum';
import { Status } from './enum/wallet.enum';
import { TwoFactorAuthService } from 'src/modules/mn-user/auth/two-factor-auth.service';
import {
  DepositRequest,
  DepositRequestStatus,
} from './entities/deposit-request.entity';
import { CreateDepositRequestDto } from './dto/create-deposit-request.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private twoFactorAuthService: TwoFactorAuthService,
    @InjectRepository(DepositRequest)
    private depositRequestRepository: Repository<DepositRequest>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const [result, total] = await this.walletRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  findOne(address: string) {
    return this.walletRepository.findOne({
      where: { address },
      relations: ['user'],
    });
  }
  findWalletById(id: string) {
    return this.walletRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
  async findWalletsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const [result, total] = await this.walletRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
  async findAdminWallets(page: number = 1, limit: number = 10) {
    const [result, total] = await this.walletRepository.findAndCount({
      where: { isAdminWallet: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async getAdminWalletOptions() {
    const adminWallets = await this.walletRepository.find({
      where: { isAdminWallet: true },
      relations: ['user'],
    });

    return adminWallets.map((wallet) => ({
      value: wallet.address,
      label: `${wallet.name || 'BINEX'}`,
      id: wallet.id,
      name: wallet.name,
      address: wallet.address,
      user: wallet.user
        ? {
            id: wallet.user.id,
            username: wallet.user.userName,
            email: wallet.user.email,
          }
        : null,
    }));
  }

  async update(updateWalletDto: UpdateWalletDto) {
    const wallet = await this.walletRepository.findOne({
      where: { id: updateWalletDto.id },
    });
    if (!wallet) {
      throw new BadRequestException('Ví không tồn tại');
    }

    const updateWallet = this.walletRepository.merge(wallet, updateWalletDto);

    return this.walletRepository.save(updateWallet);
  }

  async remove(id: string) {
    const wallet = await this.walletRepository.findOne({
      where: { id },
    });
    if (!wallet) {
      throw new BadRequestException('Ví không tồn tại');
    }
    return this.walletRepository.remove(wallet);
  }
  async key() {
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

  async create(createWalletDto: CreateWalletDto) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      const userId = createWalletDto.userId;
      const user = await manager.findOne(User, {
        where: { id: userId },
      });
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
          status: Status.Active,
        });

        savedWallet = await manager.save(wallet);

        // Khởi tạo số dư VND và USD (USDT) mặc định bằng 0 cho ví mới
        const vndBalance = manager.create(Currency, {
          walletId: savedWallet.id,
          userId: savedWallet.userId,
          currency: CurrencyType.VND,
          balance: 0,
        });

        const usdBalance = manager.create(Currency, {
          walletId: savedWallet.id,
          userId: savedWallet.userId,
          currency: CurrencyType.USDT,
          balance: 0,
        });

        await manager.save([vndBalance, usdBalance]);
      }

      return savedWallet;
    });
  }

  async depositAdmin(depositDto: DepositDto) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      const { amount, currency, address, bankingId, description } = depositDto;
      if (!amount || amount <= 0) {
        throw new BadRequestException('Số tiền nạp phải lớn hơn 0');
      }
      if (!['VND', 'USD'].includes(currency)) {
        throw new BadRequestException('Loại tiền không hợp lệ');
      }
      const wallet = await manager.findOne(Wallet, {
        where: { address },
      });
      if (!wallet) {
        throw new BadRequestException('Ví không tồn tại');
      }

      const bankingPay = bankingId
        ? await manager.findOne(Banking, { where: { id: bankingId } })
        : null;
      if (bankingId && !bankingPay) {
        throw new BadRequestException('Không tìm thấy ngân hàng đã chọn');
      }

      // Xác định loại tiền tệ tương ứng trong database (VND -> VND, USD -> USDT)
      const dbCurrency =
        currency === 'VND' ? CurrencyType.VND : CurrencyType.USDT;

      // Tìm bản ghi Currency tương ứng của ví này
      let userCurrency = await manager.findOne(Currency, {
        where: { walletId: wallet.id, currency: dbCurrency },
      });

      // Nếu chưa có bản ghi số dư thì tạo mới
      if (!userCurrency) {
        userCurrency = manager.create(Currency, {
          walletId: wallet.id,
          userId: wallet.userId,
          currency: dbCurrency,
          balance: 0,
        });
      }

      // Cộng tiền vào số dư và lưu lại
      userCurrency.balance = Number(userCurrency.balance) + Number(amount);
      await manager.save(userCurrency);

      // Tạo lịch sử giao dịch vào bảng Transaction
      const transactionHistory = manager.create(Transaction, {
        type: TypeTranslateEnum.DEPOSIT,
        amount,
        currency: dbCurrency,
        from: bankingPay?.address || 'BINEX',
        to: wallet.address,
        method: MethodTranslateEnum.BANK,
        description: description || 'Nạp tiền vào ví từ Admin',
        status: StatusTranslateEnum.COMPLETED,
      });
      await manager.save(transactionHistory);

      return {
        message: 'Nạp tiền thành công',
        walletId: wallet.id,
        currency: dbCurrency,
        newBalance: userCurrency.balance,
      };
    });
  }

  async getBalance(address: string) {
    const wallet = await this.walletRepository.findOne({
      where: { address },
      relations: ['balances'],
    });
    if (!wallet) {
      throw new BadRequestException('Ví không tồn tại');
    }

    // Lấy số dư VND và USD trực tiếp từ wallet.balances đã được map sẵn qua relation
    const vndCurrency = wallet.balances?.find(
      (c) => c.currency === CurrencyType.VND,
    );
    const usdCurrency = wallet.balances?.find(
      (c) => c.currency === CurrencyType.USDT,
    );

    // Trả về số dư của từng loại tiền
    return {
      vnd: Number(vndCurrency?.balance || 0),
      usd: Number(usdCurrency?.balance || 0),
    };
  }

  async transfer(transferDto: TransferDto) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      const {
        senderAddress,
        receiverAddress,
        amount,
        currency,
        twoFactorToken,
        description,
      } = transferDto;

      if (senderAddress === receiverAddress) {
        throw new BadRequestException(
          'Địa chỉ ví người gửi và người nhận không được trùng nhau',
        );
      }

      if (!amount || amount <= 0) {
        throw new BadRequestException('Số tiền chuyển phải lớn hơn 0');
      }

      // Tìm ví người gửi kèm quan hệ user để lấy 2FA
      const senderWallet = await manager.findOne(Wallet, {
        where: { address: senderAddress },
        relations: ['user'],
      });
      if (!senderWallet) {
        throw new BadRequestException('Ví người gửi không tồn tại');
      }

      // Xác thực bảo mật 2FA của ví người gửi
      if (!senderWallet.user) {
        throw new BadRequestException(
          'Ví người gửi không liên kết với tài khoản người dùng',
        );
      }

      if (
        !senderWallet.user.twoFactorEnabled ||
        !senderWallet.user.twoFactorSecret
      ) {
        throw new BadRequestException(
          'Tài khoản chưa kích hoạt bảo mật 2FA. Vui lòng kích hoạt 2FA trước khi chuyển tiền.',
        );
      }

      const isValid2FA = this.twoFactorAuthService.verifyTwoFactorToken(
        twoFactorToken,
        senderWallet.user.twoFactorSecret,
      );
      if (!isValid2FA) {
        throw new BadRequestException('Mã xác thực 2FA không chính xác');
      }

      // Tìm ví người nhận
      const receiverWallet = await manager.findOne(Wallet, {
        where: { address: receiverAddress },
      });
      if (!receiverWallet) {
        throw new BadRequestException('Ví người nhận không tồn tại');
      }

      // Xác định loại tiền tệ
      const normalizedCurrency = currency.toUpperCase();
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

      // Kiểm tra và trừ số dư người gửi
      const senderCurrency = await manager.findOne(Currency, {
        where: { walletId: senderWallet.id, currency: dbCurrency },
      });

      if (!senderCurrency || Number(senderCurrency.balance) < amount) {
        throw new BadRequestException('Số dư tài khoản không đủ');
      }

      senderCurrency.balance = Number(senderCurrency.balance) - amount;
      await manager.save(senderCurrency);

      // Cộng số dư người nhận
      let receiverCurrency = await manager.findOne(Currency, {
        where: { walletId: receiverWallet.id, currency: dbCurrency },
      });

      if (!receiverCurrency) {
        receiverCurrency = manager.create(Currency, {
          walletId: receiverWallet.id,
          userId: receiverWallet.userId,
          currency: dbCurrency,
          balance: 0,
        });
      }

      receiverCurrency.balance = Number(receiverCurrency.balance) + amount;
      await manager.save(receiverCurrency);

      // Tạo lịch sử giao dịch vào bảng Transaction
      const transactionHistory = manager.create(Transaction, {
        type: TypeTranslateEnum.TRANSFER,
        amount,
        currency: dbCurrency,
        from: senderAddress,
        to: receiverAddress,
        method: MethodTranslateEnum.WALLET,
        description: description || 'Chuyển tiền ví',
        status: StatusTranslateEnum.COMPLETED,
      });
      await manager.save(transactionHistory);

      return {
        message: 'Chuyển tiền thành công',
        senderAddress,
        receiverAddress,
        amount,
        currency: dbCurrency,
        senderNewBalance: senderCurrency.balance,
      };
    });
  }

  async depositFromAdminWallet(depositFromAdminDto: DepositFromAdminDto) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      const { receiverAddress, amount, currency, adminPin, description } =
        depositFromAdminDto;

      if (!amount || amount <= 0) {
        throw new BadRequestException('Số tiền nạp phải lớn hơn 0');
      }

      // Tìm ví admin hệ thống
      const adminWallet = await manager.findOne(Wallet, {
        where: { isAdminWallet: true },
      });
      if (!adminWallet) {
        throw new BadRequestException('Không tìm thấy ví Admin hệ thống');
      }

      // Xác thực bảo mật PIN của ví Admin để tránh bị hack
      if (adminWallet.pin !== adminPin) {
        throw new BadRequestException(
          'Mã PIN bảo mật ví Admin không chính xác',
        );
      }

      if (adminWallet.address === receiverAddress) {
        throw new BadRequestException(
          'Ví nhận không được trùng với ví Admin gửi',
        );
      }

      // Tìm ví người nhận
      const receiverWallet = await manager.findOne(Wallet, {
        where: { address: receiverAddress },
      });
      if (!receiverWallet) {
        throw new BadRequestException('Ví người nhận không tồn tại');
      }

      // Xác định loại tiền tệ
      const normalizedCurrency = currency.toUpperCase();
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

      // Kiểm tra và trừ số dư ví admin
      const adminCurrency = await manager.findOne(Currency, {
        where: { walletId: adminWallet.id, currency: dbCurrency },
      });

      if (!adminCurrency || Number(adminCurrency.balance) < amount) {
        throw new BadRequestException('Số dư tài khoản ví Admin không đủ');
      }

      adminCurrency.balance = Number(adminCurrency.balance) - amount;
      await manager.save(adminCurrency);

      // Cộng số dư ví người nhận
      let receiverCurrency = await manager.findOne(Currency, {
        where: { walletId: receiverWallet.id, currency: dbCurrency },
      });

      if (!receiverCurrency) {
        receiverCurrency = manager.create(Currency, {
          walletId: receiverWallet.id,
          userId: receiverWallet.userId,
          currency: dbCurrency,
          balance: 0,
        });
      }

      receiverCurrency.balance = Number(receiverCurrency.balance) + amount;
      await manager.save(receiverCurrency);

      // Tạo lịch sử giao dịch vào bảng Transaction
      const transactionHistory = manager.create(Transaction, {
        type: TypeTranslateEnum.DEPOSIT,
        amount,
        currency: dbCurrency,
        from: adminWallet.address,
        to: receiverAddress,
        method: MethodTranslateEnum.WALLET,
        description: description || 'Nạp tiền vào ví từ Admin',
        status: StatusTranslateEnum.COMPLETED,
      });
      await manager.save(transactionHistory);

      return {
        message: 'Nạp tiền từ ví Admin thành công',
        adminAddress: adminWallet.address,
        receiverAddress,
        amount,
        currency: dbCurrency,
        receiverNewBalance: receiverCurrency.balance,
      };
    });
  }

  async createDepositRequest(userId: string, dto: CreateDepositRequestDto) {
    const wallet = await this.walletRepository.findOne({
      where: { address: dto.walletAddress },
    });
    if (!wallet) {
      throw new BadRequestException('Địa chỉ ví nhận tiền không tồn tại');
    }

    const normalizedCurrency = dto.currency.toUpperCase();
    let dbCurrency: CurrencyType;
    if (normalizedCurrency === 'VND' || normalizedCurrency === 'VNĐ') {
      dbCurrency = CurrencyType.VND;
    } else if (normalizedCurrency === 'USDT' || normalizedCurrency === 'USD') {
      dbCurrency = CurrencyType.USDT;
    } else {
      dbCurrency = normalizedCurrency as CurrencyType;
    }

    const depositRequest = this.depositRequestRepository.create({
      userId,
      walletAddress: dto.walletAddress,
      amount: dto.amount,
      currency: dbCurrency,
      proofImage: dto.proofImage,
      transactionCode: dto.transactionCode,
      status: DepositRequestStatus.PENDING,
    });

    return await this.depositRequestRepository.save(depositRequest);
  }

  async getDepositRequests(
    page: number = 1,
    limit: number = 10,
    status?: DepositRequestStatus,
  ) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [result, total] = await this.depositRequestRepository.findAndCount({
      where,
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async approveDepositRequest(id: string) {
    return await this.walletRepository.manager.transaction(async (manager) => {
      const request = await manager.findOne(DepositRequest, {
        where: { id },
      });
      if (!request) {
        throw new BadRequestException('Không tìm thấy đơn nạp tiền');
      }

      if (request.status !== DepositRequestStatus.PENDING) {
        throw new BadRequestException(
          'Đơn nạp tiền này đã được xử lý trước đó',
        );
      }

      const wallet = await manager.findOne(Wallet, {
        where: { address: request.walletAddress },
      });
      if (!wallet) {
        throw new BadRequestException('Ví người nhận không tồn tại');
      }

      let userCurrency = await manager.findOne(Currency, {
        where: { walletId: wallet.id, currency: request.currency },
      });

      if (!userCurrency) {
        userCurrency = manager.create(Currency, {
          walletId: wallet.id,
          userId: wallet.userId,
          currency: request.currency,
          balance: 0,
        });
      }

      userCurrency.balance =
        Number(userCurrency.balance) + Number(request.amount);
      await manager.save(userCurrency);

      request.status = DepositRequestStatus.APPROVED;
      await manager.save(request);

      const transactionHistory = manager.create(Transaction, {
        type: TypeTranslateEnum.DEPOSIT,
        amount: request.amount,
        currency: request.currency,
        from: 'USER_DEPOSIT',
        to: wallet.address,
        method: MethodTranslateEnum.BANK,
        description: `Nạp tiền thành công từ đơn nạp. Mã giao dịch: ${request.transactionCode}`,
        status: StatusTranslateEnum.COMPLETED,
      });
      await manager.save(transactionHistory);

      return {
        message: 'Duyệt đơn nạp tiền thành công',
        requestId: request.id,
        newBalance: userCurrency.balance,
      };
    });
  }

  async rejectDepositRequest(id: string) {
    const request = await this.depositRequestRepository.findOne({
      where: { id },
    });
    if (!request) {
      throw new BadRequestException('Không tìm thấy đơn nạp tiền');
    }

    if (request.status !== DepositRequestStatus.PENDING) {
      throw new BadRequestException('Đơn nạp tiền này đã được xử lý trước đó');
    }

    request.status = DepositRequestStatus.REJECTED;
    await this.depositRequestRepository.save(request);

    return {
      message: 'Từ chối đơn nạp tiền thành công',
      requestId: request.id,
    };
  }
}
