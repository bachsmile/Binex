import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { LoginResponse, RedeemKeyResponse } from './responses/auth.response';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from './enums/role.enum';
import { ActivationKey } from './entities/activation-key.entity';
import { Package } from '../service/entities/package.entity';
import { UserSubscription } from '../user/entities/user-subscription.entity';
import { ServiceGroup } from '../service-group/entities/service-group.entity';
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
    @InjectRepository(UserSubscription)
    private subscriptionRepository: Repository<UserSubscription>,
    @InjectRepository(ServiceGroup)
    private serviceGroupRepository: Repository<ServiceGroup>,
    private jwtService: JwtService,
    private mailService: MailService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  async create(createAuthDto: CreateAuthDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { userName: createAuthDto.userName },
    });

    if (existingUser) {
      throw new BadRequestException('Tên đăng nhập đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

    let role = Role.USER;
    if (createAuthDto.code === '753951') {
      role = Role.SUPER_ADMIN;
    }

    const user = this.userRepository.create({
      ...createAuthDto,
      password: hashedPassword,
      role,
      status: UserStatus.PENDING,
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

    let role = Role.ADMIN;
    if (createAuthDto.code === '753951') {
      role = Role.SUPER_ADMIN;
    }

    const user = await this.userRepository.save(
      this.userRepository.create({
        ...createAuthDto,
        password: hashedPassword,
        role,
        status: UserStatus.PENDING,
      }),
    );

    // Tạo mã kích hoạt dựa trên serviceId (nếu có)
    if (createAuthDto.serviceId) {
      // Tìm gói mặc định hoặc gói phù hợp
      const pkg = await this.packageRepository.findOne({
        where: {},
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
      serviceGroupId: serviceId,
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
    const serviceGroup = await this.serviceGroupRepository.findOne({
      where: { id: activationKey.serviceGroupId },
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
      service: serviceGroup
        ? {
            id: serviceGroup.id,
            name: serviceGroup.name,
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
    const serviceGroup = await this.serviceGroupRepository.findOne({
      where: { id: activationKey.serviceGroupId },
    });

    if (!pkg || !serviceGroup) {
      throw new BadRequestException('Gói dịch vụ không còn tồn tại');
    }

    // Kiểm tra xem người dùng đã có quyền cho Service/Package này chưa
    let subscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        packId: pkg.id,
      },
    });

    const durationDays = activationKey.days || pkg.expire || 30;
    let newExpiredAt: Date;

    if (subscription) {
      // Sử dụng hàm gia hạn từ UserService
      const updatedSubscription = await this.userService.extendSubscription(
        subscription.id,
        durationDays,
      );
      newExpiredAt = updatedSubscription.expiredAt;
    } else {
      // Nếu chưa có, tạo mới gói đăng ký
      newExpiredAt = new Date();
      newExpiredAt.setDate(newExpiredAt.getDate() + durationDays);

      subscription = this.subscriptionRepository.create({
        userId,
        packId: pkg.id,
        serviceGroupId: serviceGroup.id,
        ac: 15,
        expiredAt: newExpiredAt,
      });
      await this.subscriptionRepository.save(subscription);
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
    if (!user.serviceIds.includes(serviceGroup.id)) {
      user.serviceIds.push(serviceGroup.id);
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
    } as RedeemKeyResponse;
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
      relations: [
        'userSubscriptions',
        'userSubscriptions.package',
        'userSubscriptions.package.services',
      ],
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

  async login(loginDto: LoginDto, xRole?: string): Promise<LoginResponse> {
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
      userSubscriptions: user.userSubscriptions?.map((item) => {
        return {
          ser: item.package?.services?.[0]?.code || item.serviceGroupId,
          pack: item.packId,
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
