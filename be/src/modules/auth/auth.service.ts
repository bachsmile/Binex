import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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
