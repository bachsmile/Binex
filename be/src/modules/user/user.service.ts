import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Raw, ILike, DataSource, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserSubscription } from './entities/user-subscription.entity';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Service } from '../service/entities/service.entity';
import { Package } from '../service/entities/package.entity';
import { Role } from '../auth/enums/role.enum';
import { UserStatus } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserSubscription)
    private subscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    private dataSource: DataSource,
  ) {}

  async findPackageById(id: string) {
    return await this.packageRepository.findOne({ where: { id } });
  }

  async activateUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.status = UserStatus.ACTIVE;
      return await this.userRepository.save(user);
    }
    return null;
  }

  async updateSubscriptions(
    userId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    // 1. Delete existing subscriptions
    await this.subscriptionRepository.delete({ userId });

    // 2. Create new subscriptions directly from DTO
    const subscriptions = updateSubscriptionDto.subscriptions.map((s) => {
      return this.subscriptionRepository.create({
        userId,
        packId: s.packId,
        serviceGroupId: s.serviceId,
        ac: s.ac,
        expiredAt: s.expiredAt ? new Date(s.expiredAt) : undefined,
      });
    });

    // 3. Save to database
    return await this.subscriptionRepository.save(subscriptions);
  }

  async activatePackage(
    userId: string,
    packageId: string,
    serviceId?: string,
    ac?: number,
  ): Promise<UserSubscription> {
    const pkg = await this.packageRepository.findOne({
      where: { id: packageId },
    });
    if (!pkg) {
      throw new BadRequestException('Gói dịch vụ không tồn tại');
    }

    const now = new Date();
    const resolvedServiceId = serviceId || 'SER_001';
    const resolvedAc = ac || 15;

    // 1. Tìm subscription hiện tại của user cho service này trực tiếp theo serviceId
    let subscription = await this.subscriptionRepository.findOne({
      where: { userId, serviceGroupId: resolvedServiceId },
    });

    if (subscription) {
      // Gia hạn hoặc cập nhật subscription hiện tại
      const newExpiredAt = new Date();
      if (subscription.expiredAt && subscription.expiredAt > now) {
        newExpiredAt.setTime(
          subscription.expiredAt.getTime() + pkg.expire * 24 * 60 * 60 * 1000,
        );
      } else {
        newExpiredAt.setTime(now.getTime() + pkg.expire * 24 * 60 * 60 * 1000);
      }
      subscription.packId = pkg.id;
      subscription.serviceGroupId = resolvedServiceId;
      subscription.ac = resolvedAc;
      subscription.expiredAt = newExpiredAt;
      subscription.updatedAt = now;
    } else {
      // Tạo mới subscription
      const expiredAt = new Date();
      expiredAt.setTime(now.getTime() + pkg.expire * 24 * 60 * 60 * 1000);

      subscription = this.subscriptionRepository.create({
        userId,
        packId: pkg.id,
        serviceGroupId: resolvedServiceId,
        ac: resolvedAc,
        expiredAt,
      });
    }

    return await this.subscriptionRepository.save(subscription);
  }

  async findLatestSubscriptionByUserId(
    userId: string,
  ): Promise<UserSubscription | null> {
    return await this.subscriptionRepository.findOne({
      where: { userId },
      order: { expiredAt: 'DESC' },
    });
  }

  async extendSubscription(subscriptionId: string, days: number) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription record not found');
    }

    const currentExpiry = subscription.expiredAt
      ? new Date(subscription.expiredAt)
      : new Date();

    // Add days to current expiry
    currentExpiry.setDate(currentExpiry.getDate() + days);

    subscription.expiredAt = currentExpiry;
    subscription.updatedAt = new Date();

    return await this.subscriptionRepository.save(subscription);
  }

  async changePackage(subscriptionId: string, newPackageId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });
    if (!subscription) {
      throw new BadRequestException('Không tìm thấy bản ghi đăng ký gói');
    }

    const newPackage = await this.packageRepository.findOne({
      where: { id: newPackageId },
    });
    if (!newPackage) {
      throw new BadRequestException('Gói mới không tồn tại');
    }

    // Kiểm tra: Chỉ được đổi sang gói không phải là Group
    if (newPackage.isGroup) {
      throw new BadRequestException('Không thể đổi sang gói dành cho nhóm');
    }

    const oldPackage = await this.packageRepository.findOne({
      where: { id: subscription.packId },
    });

    const now = new Date();
    let newExpiredAt = new Date();

    if (subscription.expiredAt && subscription.expiredAt > now && oldPackage) {
      // 1. Tính giá trị còn lại của gói cũ (Value = RemainingDays * PricePerDay)
      const remainingMs = subscription.expiredAt.getTime() - now.getTime();
      const remainingDays = remainingMs / (1000 * 60 * 60 * 24);

      const oldPrice = parseFloat(oldPackage.price) || 0;
      const oldDuration = oldPackage.expire || 30;
      const oldPricePerDay = oldPrice / oldDuration;

      const remainingValue = remainingDays * oldPricePerDay;

      // 2. Quy đổi giá trị đó sang thời gian của gói mới (NewDays = Value / NewPricePerDay)
      const newPrice = parseFloat(newPackage.price) || 0;
      const newDuration = newPackage.expire || 30;
      const newPricePerDay = newPrice / newDuration;

      if (newPricePerDay > 0) {
        const addedDays = remainingValue / newPricePerDay;
        newExpiredAt.setTime(now.getTime() + addedDays * (1000 * 60 * 60 * 24));
      } else {
        newExpiredAt = subscription.expiredAt;
      }
    } else {
      // Nếu không có thời gian còn lại, mặc định là hết hạn ngay (chờ nạp gói mới)
      newExpiredAt = now;
    }

    // 3. Cập nhật thông tin đăng ký theo gói mới
    subscription.packId = newPackage.id;
    subscription.ac = subscription.ac || 15; // Preserve existing ac or fallback to 15
    subscription.expiredAt = newExpiredAt;
    subscription.updatedAt = now;

    return await this.subscriptionRepository.save(subscription);
  }

  async getUserSubscriptions(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const subscriptions = await this.subscriptionRepository.find({
      where: { userId },
    });
    return subscriptions;
  }

  async create(createUserDto: CreateUserDto, creatorId?: string) {
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // 2. Xác định Role dựa trên secret code
    let role = Role.USER;
    console.log(createUserDto.code);

    if (createUserDto.code === '753951') {
      role = Role.SUPER_ADMIN;
    }

    // 4. Tạo mã code ref 8 ký tự ngẫu nhiên
    const refCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Xác định ID người quản lý để gán vào danh sách managerIds của user mới
    let managerIdToLink = creatorId;
    if (createUserDto.code) {
      const manager = await this.userRepository.findOne({
        where: { code: createUserDto.code },
      });
      if (manager) {
        managerIdToLink = manager.id;
      }
    }

    // 5. Build user instance with dynamic parameters to avoid strict TS compilation errors
    const userPayload: any = {
      ...createUserDto,
      password: hashedPassword,
      role,
      code: refCode,
    };

    if (creatorId) {
      userPayload.createdBy = creatorId;
    }

    if (managerIdToLink) {
      userPayload.managerIds = [managerIdToLink];
    }

    const newUser = this.userRepository.create(userPayload);

    // 4. Save to database
    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async findAll(status?: UserStatus, role?: Role) {
    const where: any = {};
    if (status) where.status = status;
    if (role) where.role = role;
    return await this.userRepository.find({
      where,
      relations: ['userSubscriptions'],
    });
  }

  async findPage(
    page: number = 1,
    limit: number = 10,
    status?: UserStatus,
    role?: Role,
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (role) where.role = role;

    const [data, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['userSubscriptions'],
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      total,
    };
  }

  async findByManager(
    managerId: string,
    page: number = 1,
    limit: number = 10,
    status?: UserStatus,
    role?: Role,
    search?: string,
  ) {
    const where: any = {
      managerIds: Raw((alias) => `:managerId = ANY(${alias})`, { managerId }),
    };
    if (status) where.status = status;
    if (role) where.role = role;
    if (search) {
      where.userName = ILike(`%${search}%`);
    }

    const [data, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['userSubscriptions'],
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userSubscriptions'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    const deletedUser = await this.userRepository.delete(id);
    return deletedUser;
  }

  async getUserStorageLimit(userId: string): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user && Number(user.storageLimit) > 0) {
      return Number(user.storageLimit);
    }

    const now = new Date();
    const subscriptions = await this.subscriptionRepository.find({
      where: { userId },
    });

    const activeSubscriptions = subscriptions.filter(
      (s) => !s.expiredAt || s.expiredAt > now,
    );

    let totalLimit = 0;
    for (const p of activeSubscriptions) {
      if (p.packId) {
        const pkg = await this.packageRepository.findOne({
          where: { id: p.packId },
        });
        if (pkg) {
          if (pkg.storageLimit === 0) return 0; // Không giới hạn
          totalLimit += pkg.storageLimit;
        }
      }
    }
    return totalLimit; // Trả về đơn vị MB
  }

  async updateUsedStorage(userId: string, mb: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      const currentUsed = Number(user.usedStorage) || 0;
      user.usedStorage = Number((currentUsed + mb).toFixed(4));
      await this.userRepository.save(user);
    }
  }

  async updateStorageLimit(userId: string, limitMB: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.storageLimit = limitMB;
    return await this.userRepository.save(user);
  }

  async getUserRecordLimit(userId: string, limitKey: string): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (
      user &&
      user.recordLimit &&
      typeof user.recordLimit[limitKey] !== 'undefined'
    ) {
      const userLimit = Number(user.recordLimit[limitKey]);
      if (userLimit > 0) return userLimit;
    }

    const now = new Date();
    const subscriptions = await this.subscriptionRepository.find({
      where: { userId },
    });

    const activeSubscriptions = subscriptions.filter(
      (s) => !s.expiredAt || s.expiredAt > now,
    );

    let totalLimit = 0;
    let isUnlimited = false;

    for (const p of activeSubscriptions) {
      if (p.packId) {
        const pkg = await this.packageRepository.findOne({
          where: { id: p.packId },
        });
        if (
          pkg &&
          pkg.recordLimit &&
          typeof pkg.recordLimit[limitKey] !== 'undefined'
        ) {
          const pkgLimit = Number(pkg.recordLimit[limitKey]);
          if (pkgLimit === 0) {
            isUnlimited = true;
            break;
          }
          totalLimit += pkgLimit;
        }
      }
    }

    if (isUnlimited) return 0;
    return totalLimit;
  }

  async updateRecordLimit(userId: string, key: string, value: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const recordLimit = user.recordLimit || {};
    recordLimit[key] = value;
    user.recordLimit = recordLimit;
    return await this.userRepository.save(user);
  }

  async clearAllExceptUsers() {
    // 1. Lấy danh sách tất cả các metadata của các thực thể (entities)
    const entities = this.dataSource.entityMetadatas;

    // 2. Lọc ra các bảng cần xóa (loại trừ bảng user)
    const entitiesToClear = entities.filter(
      (entity) => entity.name !== 'User' && entity.tableName !== 'user',
    );

    // 3. Sử dụng QueryRunner để thực hiện xóa nhanh và bỏ qua các ràng buộc khóa ngoại (CASCADE)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const entity of entitiesToClear) {
        await queryRunner.query(
          `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`,
        );
      }

      await queryRunner.commitTransaction();
      return {
        status: true,
        message:
          'Đã xóa toàn bộ dữ liệu tất cả các bảng (trừ bảng người dùng) thành công!',
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Lỗi khi dọn dẹp dữ liệu: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
