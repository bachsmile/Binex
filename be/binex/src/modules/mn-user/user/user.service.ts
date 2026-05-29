import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { UserMicro } from './entities/user-micro.entity';
import { Package } from 'src/modules/mn-service/packages/entities/package.entity';
import { PK_Micro } from 'src/modules/mn-service/packages/entities/pk-micro';
import { randomString } from 'src/common/utils/string.utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserMicro)
    private readonly userMicroRepository: Repository<UserMicro>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(PK_Micro)
    private readonly pkMicroRepository: Repository<PK_Micro>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { userName: createUserDto.userName },
    });
    if (user) {
      throw new Error('Người dùng đã tồn tại');
    }

    let refferCode = '';
    let isUnique = false;
    while (!isUnique) {
      refferCode = randomString(8).toUpperCase();
      const existing = await this.userRepository.findOne({
        where: { reffer: refferCode },
      });
      if (!existing) isUnique = true;
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      reffer: refferCode,
    });
    return await this.userRepository.save(newUser);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [result, total] = await this.userRepository.findAndCount({
      take: limit,
      skip,
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

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const updated = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updated);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return this.userRepository.remove(user);
  }

  async addPackageToUser(userId: string, packId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const pkg = await this.packageRepository.findOne({ where: { id: packId } });
    if (!pkg) {
      throw new NotFoundException('Không tìm thấy gói');
    }

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + pkg.expire);

    const userMicro = this.userMicroRepository.create({
      userId,
      packId,
      expiredAt,
    });

    return this.userMicroRepository.save(userMicro);
  }

  async findPackagesByUser(userId: string, includeMicros: boolean = false) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    const relations = await this.userMicroRepository.find({
      where: { userId },
      relations: ['package'],
    });

    const packIds = relations.map((r) => r.packId).filter((packId) => !!packId);

    // Group microservices by packageId if includeMicros is true
    const packageMicrosMap = new Map<string, any[]>();
    if (includeMicros && packIds.length > 0) {
      const pkMicros = await this.pkMicroRepository.find({
        where: { packageId: In(packIds) },
        relations: ['micro'],
      });

      pkMicros.forEach((pm) => {
        if (pm.micro) {
          const list = packageMicrosMap.get(pm.packageId) || [];
          list.push(pm.micro);
          packageMicrosMap.set(pm.packageId, list);
        }
      });
    }

    return relations.map((r) => ({
      ...r.package,
      expiredAt: r.expiredAt,
      subscribedAt: r.createdAt,
      microservices: includeMicros
        ? packageMicrosMap.get(r.packId) || []
        : undefined,
    }));
  }

  async findMicroServicesByUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // 1. Lấy tất cả gói đăng ký còn hạn của user
    const now = new Date();
    const userMicros = await this.userMicroRepository.find({
      where: [
        { userId, expiredAt: MoreThanOrEqual(now) },
        { userId, expiredAt: IsNull() },
      ],
    });

    const packIds = userMicros
      .map((um) => um.packId)
      .filter((packId) => !!packId);

    if (packIds.length === 0) {
      return [];
    }

    // 2. Tìm tất cả microservice liên kết trực tiếp với các packIds này qua pk_micro
    const pkMicros = await this.pkMicroRepository.find({
      where: { packageId: In(packIds) },
      relations: ['micro'],
    });

    // 3. Trích xuất và loại bỏ trùng lặp các microservice
    const microMap = new Map<string, any>();
    pkMicros.forEach((pm) => {
      if (pm.micro) {
        microMap.set(pm.micro.id, pm.micro);
      }
    });

    return Array.from(microMap.values());
  }
}
