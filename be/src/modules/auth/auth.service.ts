import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/decorators/roles.decorator';
import { ActivationKey } from './entities/activation-key.entity';
import { Package } from '../service/entities/package.entity';
import { UserPermission } from '../user/entities/user-permission.entity';
import { Service } from '../service/entities/service.entity';
import { MailService } from '../mail/mail.service';
import { forwardRef, Inject } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ActivationKey)
    private activationKeyRepository: Repository<ActivationKey>,
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    @InjectRepository(UserPermission)
    private permissionRepository: Repository<UserPermission>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    const existingUser = await this.userRepository.findOne({
      where: { userName: createAuthDto.userName },
    });

    if (existingUser) {
      throw new BadRequestException('Tên đăng nhập đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const user = this.userRepository.create({
      ...createAuthDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async createAd(createAuthDto: CreateAuthDto) {
    const existingUser = await this.userRepository.findOne({
      where: { userName: createAuthDto.userName },
    });

    if (existingUser) {
      throw new BadRequestException('Tên đăng nhập đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const user = await this.userRepository.save(
      this.userRepository.create({
        ...createAuthDto,
        password: hashedPassword,
        role: Role.ADMIN,
        status: UserStatus.PENDING,
      }),
    );

    // Tạo mã kích hoạt dựa trên serviceId (nếu có)
    if (createAuthDto.serviceId) {
      // Tìm gói mặc định hoặc gói phù hợp cho service này
      const pkg = await this.packageRepository.findOne({
        where: { serviceId: createAuthDto.serviceId },
      });

      if (pkg) {
        const activationKey = await this.generateActivationKey(
          pkg.id,
          createAuthDto.serviceId,
        );
        // Gửi mail
        await this.mailService.sendActivationKey(
          user.email,
          activationKey.key,
          pkg.name,
        );
      }
    }

    return user;
  }

  public async generateActivationKey(
    packageId: string,
    serviceId: string,
    role?: Role,
    days?: number,
    mailto?: string,
  ) {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Thiết lập ngày hết hạn cho mã (mặc định là 7 ngày kể từ lúc tạo)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const activationKey = this.activationKeyRepository.create({
      key,
      packageId,
      serviceId,
      role,
      days,
      expiresAt,
    });

    const savedKey = await this.activationKeyRepository.save(activationKey);

    // Nếu có mailto thì gửi mail ngay
    if (mailto) {
      const pkg = await this.packageRepository.findOne({
        where: { id: packageId },
      });
      const packageName = pkg ? pkg.description : 'Gói dịch vụ';
      await this.mailService.sendActivationKey(
        mailto,
        savedKey.key,
        packageName,
      );
    }

    return savedKey;
  }

  async getKeyInfo(key: string) {
    const activationKey = await this.activationKeyRepository.findOne({
      where: { key: key.toUpperCase() },
    });

    if (!activationKey) {
      throw new BadRequestException('Mã kích hoạt không tồn tại');
    }

    const pkg = await this.packageRepository.findOne({
      where: { id: activationKey.packageId },
    });
    const service = await this.serviceRepository.findOne({
      where: { id: activationKey.serviceId },
    });

    return {
      key: activationKey.key,
      isUsed: activationKey.isUsed,
      role: activationKey.role,
      days: activationKey.days,
      expiresAt: activationKey.expiresAt,
      package: pkg
        ? {
            id: pkg.id,
            name: pkg.name,
            expire: pkg.expire, // Số ngày sử dụng
          }
        : null,
      service: service
        ? {
            id: service.id,
            name: service.name,
          }
        : null,
    };
  }

  async redeemActivationKey(userId: string, key: string) {
    const activationKey = await this.activationKeyRepository.findOne({
      where: { key: key.toUpperCase(), isUsed: false },
    });

    if (!activationKey) {
      throw new BadRequestException(
        'Mã kích hoạt không hợp lệ hoặc đã sử dụng',
      );
    }

    // Kiểm tra hết hạn của mã
    if (activationKey.expiresAt && new Date() > activationKey.expiresAt) {
      throw new BadRequestException('Mã kích hoạt đã hết hạn');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // Lấy thông tin Package và Service
    const pkg = await this.packageRepository.findOne({
      where: { id: activationKey.packageId },
    });
    const service = await this.serviceRepository.findOne({
      where: { id: activationKey.serviceId },
    });

    if (!pkg || !service) {
      throw new BadRequestException('Gói dịch vụ không còn tồn tại');
    }

    // Kiểm tra xem người dùng đã có quyền cho Service/Package này chưa
    let permission = await this.permissionRepository.findOne({
      where: {
        userId,
        serId: service.id,
        packId: pkg.id,
      },
    });

    const durationDays = activationKey.days || pkg.expire || 30;
    let newExpiredAt: Date;

    if (permission) {
      // Sử dụng hàm gia hạn từ UserService
      const updatedPermission = await this.userService.extendPermission(
        permission.id,
        durationDays,
      );
      newExpiredAt = updatedPermission.expiredAt;
    } else {
      // Nếu chưa có, tạo mới quyền
      newExpiredAt = new Date();
      newExpiredAt.setDate(newExpiredAt.getDate() + durationDays);

      permission = this.permissionRepository.create({
        userId,
        serId: service.id,
        serName: service.name,
        packId: pkg.id,
        packName: pkg.name,
        ac: pkg.ser || 15,
        expiredAt: newExpiredAt,
      });
      await this.permissionRepository.save(permission);
    }

    // Cập nhật trạng thái người dùng và Role (nếu có)
    user.status = UserStatus.ACTIVE;
    if (activationKey.role) {
      user.role = activationKey.role;
    }

    // Cập nhật Service và Package trực tiếp vào User
    if (!user.serviceIds) {
      user.serviceIds = [];
    }
    if (!user.serviceIds.includes(service.id)) {
      user.serviceIds.push(service.id);
    }

    if (!user.packageIds) {
      user.packageIds = [];
    }
    if (!user.packageIds.includes(pkg.id)) {
      user.packageIds.push(pkg.id);
    }

    await this.userRepository.save(user);

    // Đánh dấu mã đã sử dụng
    activationKey.isUsed = true;
    activationKey.usedBy = userId;
    await this.activationKeyRepository.save(activationKey);

    return {
      message: 'Sử dụng mã thành công',
      packageName: pkg.name,
      newExpiredAt,
      roleUpdated: !!activationKey.role,
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async validateUser(userName: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { userName },
      relations: ['userPermissions'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto, xRole?: string) {
    const user = await this.validateUser(loginDto.userName, loginDto.password);

    // Validate if user has permission for the requested x-role
    if (xRole === 'admin') {
      const allowedRoles = ['ad', 'sp-ad'];
      if (!allowedRoles.includes(user.role)) {
        throw new UnauthorizedException(
          'Tài khoản không có quyền truy cập hệ thống quản trị',
        );
      }
    }

    const payload = {
      id: user.id,
      userName: user.userName,
      role: user.role,
      userPermissions: user.userPermissions?.map((item) => {
        return {
          ser: item.serName,
          pack: item.packName,
          ac: item.ac,
        };
      }),
    };
    const accessToken = this.jwtService.sign(payload);

    // Default expiration matches JwtModule (7d = 7 * 24 * 60 * 60)
    const expiresIn = 604800;

    return {
      accessToken,
      user,
      expiresIn,
    };
  }
}
