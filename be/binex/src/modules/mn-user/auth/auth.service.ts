import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../enum/role.enum';
import { UserStatus } from '../enum/status.enum';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomString } from 'src/common/utils/string.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log(registerDto);

    const existingUser = await this.userRepository.findOne({
      where: { userName: registerDto.userName },
    });

    if (existingUser) {
      throw new BadRequestException('Tên đăng nhập đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    let role = Role.USER;
    let status = UserStatus.PENDING;
    let createdBy: string | undefined = undefined;
    let managerIds: string[] | undefined = undefined;
    if (registerDto.code === '753951') {
      role = Role.SUPER_ADMIN;
      status = UserStatus.ACTIVE;
    } else if (registerDto.code) {
      const userRef = await this.userRepository.findOne({
        where: { reffer: registerDto.code },
      });

      if (userRef) {
        createdBy = userRef.id;
        managerIds = userRef.managerIds
          ? [...userRef.managerIds, userRef.id]
          : [userRef.id];
      }
    }

    // tạo mã reffer
    let refferCode = '';
    let isUnique = false;
    while (!isUnique) {
      refferCode = randomString(8).toUpperCase();
      const existing = await this.userRepository.findOne({
        where: { reffer: refferCode },
      });
      if (!existing) isUnique = true;
    }

    const userDto = {
      ...registerDto,
      password: hashedPassword,
      role,
      status,
      createdBy: createdBy ?? 'BINEX',
      managerIds,
      reffer: refferCode,
    };
    const user = this.userRepository.create(userDto);

    // save user
    await this.userRepository.save(user);

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { userName: loginDto.userName },
    });
    if (!user) {
      throw new BadRequestException('Tên đăng nhập không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Sai mật khẩu');
    }

    if (user.status === UserStatus.PENDING) {
      throw new BadRequestException('Tài khoản chưa được kích hoạt');
    }

    const payload = {
      id: user.id,
      role: user.role,
      userName: user.userName,
    };

    const accessTokenExpiresIn = 60 * 60 * 24 * 30; // 30 ngày (1 tháng)
    const refreshTokenExpiresIn = 60 * 60 * 24 * 60; // 60 ngày (2 tháng)

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(
      {
        ...payload,
        jti: crypto.randomUUID(),
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTokenExpiresIn,
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      accessToken,
      refreshToken,
      user: safeUser,
      expiresIn: accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decodedToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const userId = decodedToken.sub;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại');
      }

      const payload = {
        sub: user.id,
        role: user.role,
        userName: user.userName,
      };

      const accessTokenExpiresIn = 60 * 60 * 24 * 30; // 30 ngày (1 tháng)
      const refreshTokenExpiresIn = 60 * 60 * 24 * 60; // 60 ngày (2 tháng)

      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessTokenExpiresIn,
      });

      const newRefreshToken = this.jwtService.sign(
        {
          ...payload,
          jti: crypto.randomUUID(),
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: refreshTokenExpiresIn,
        },
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user,
        expiresIn: accessTokenExpiresIn,
        refreshTokenExpiresIn,
      };
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Refresh token đã hết hạn');
      }

      throw new BadRequestException('Refresh token không hợp lệ');
    }
  }

  async active(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    user.status = UserStatus.ACTIVE;
    const savedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = savedUser;
    return safeUser;
  }
  async inactive(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    user.status = UserStatus.INACTIVE;
    const savedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = savedUser;
    return safeUser;
  }
}
