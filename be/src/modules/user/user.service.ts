import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserPermission } from './entities/user-permission.entity';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Service } from '../service/entities/service.entity';
import { Package } from '../service/entities/package.entity';
import { Role } from 'src/decorators/roles.decorator';
import { UserStatus } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPermission)
    private permissionRepository: Repository<UserPermission>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
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

  async updatePermissions(
    userId: string,
    updatePermissionDto: UpdatePermissionDto,
  ) {
    // 1. Delete existing permissions
    await this.permissionRepository.delete({ userId });

    // 2. Create new permissions
    const permissions = updatePermissionDto.permissions.map((p) => {
      return this.permissionRepository.create({
        userId,
        serId: p.serId,
        serName: p.serName,
        packId: p.packId,
        packName: p.packName,
        ac: p.ac,
        expiredAt: p.expiredAt ? new Date(p.expiredAt) : undefined,
      });
    });

    // 3. Save to database
    return await this.permissionRepository.save(permissions);
  }

  async findLatestPermissionByUserId(
    userId: string,
  ): Promise<UserPermission | null> {
    return await this.permissionRepository.findOne({
      where: { userId },
      order: { expiredAt: 'DESC' },
    });
  }

  async extendPermission(permissionId: string, days: number) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!permission) {
      throw new Error('Permission record not found');
    }

    const currentExpiry = permission.expiredAt
      ? new Date(permission.expiredAt)
      : new Date();

    // Add days to current expiry
    currentExpiry.setDate(currentExpiry.getDate() + days);

    permission.expiredAt = currentExpiry;
    permission.updatedAt = new Date();

    return await this.permissionRepository.save(permission);
  }

  async changePackage(permissionId: string, newPackageId: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });
    if (!permission) {
      throw new BadRequestException('Không tìm thấy bản ghi quyền hạn');
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
      where: { id: permission.packId },
    });

    // Kiểm tra: Gói mới phải trùng serviceId với bản ghi hiện tại
    if (permission.serId && newPackage.serviceId !== permission.serId) {
      throw new BadRequestException(
        'Gói mới phải thuộc cùng một dịch vụ (Service)',
      );
    }

    const now = new Date();
    let newExpiredAt = new Date();

    if (permission.expiredAt && permission.expiredAt > now && oldPackage) {
      // 1. Tính giá trị còn lại của gói cũ (Value = RemainingDays * PricePerDay)
      const remainingMs = permission.expiredAt.getTime() - now.getTime();
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
        // Nếu gói mới miễn phí hoặc lỗi giá, giữ nguyên thời hạn cũ?
        // Thường thì gói mới sẽ có thời hạn riêng, nhưng theo yêu cầu là quy đổi.
        newExpiredAt = permission.expiredAt;
      }
    } else {
      // Nếu không có thời gian còn lại, mặc định là hết hạn ngay (chờ nạp gói mới)
      newExpiredAt = now;
    }

    // 3. Cập nhật thông tin quyền hạn theo gói mới
    permission.packId = newPackage.id;
    permission.packName = newPackage.name;
    permission.ac = newPackage.ser; // Cập nhật Action bits từ gói mới
    permission.expiredAt = newExpiredAt;
    permission.updatedAt = now;

    return await this.permissionRepository.save(permission);
  }

  async getUserPermissions(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const permissions = await this.permissionRepository.find({
      where: { userId },
    });
    return permissions;
  }

  async create(createUserDto: CreateUserDto) {
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 2. Xác định Role dựa trên secret code
    let role = Role.USER;
    if (createUserDto.code === '753951') {
      role = Role.SUPER_ADMIN;
    }

    // 3. Create user instance
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });

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
      relations: ['userPermissions'],
    });
  }

  async findPage(
    pageNumber: number = 1,
    pageSize: number = 10,
    status?: UserStatus,
    role?: Role,
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (role) where.role = role;

    const [data, total] = await this.userRepository.findAndCount({
      where,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      relations: ['userPermissions'],
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }

  async findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userPermissions'],
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
    const permissions = await this.permissionRepository.find({
      where: { userId },
    });

    const activePermissions = permissions.filter(
      (p) => !p.expiredAt || p.expiredAt > now,
    );

    let totalLimit = 0;
    for (const p of activePermissions) {
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
    const permissions = await this.permissionRepository.find({
      where: { userId },
    });

    const activePermissions = permissions.filter(
      (p) => !p.expiredAt || p.expiredAt > now,
    );

    let totalLimit = 0;
    let isUnlimited = false;

    for (const p of activePermissions) {
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
}
