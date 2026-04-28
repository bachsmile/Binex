import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserPermission } from './entities/user-permission.entity';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Serivce } from '../serivce/entities/serivce.entity';
import { Package } from '../package/entities/package.entity';
import { Role } from 'src/decorators/roles.decorator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPermission)
    private permissionRepository: Repository<UserPermission>,
    @InjectRepository(Serivce)
    private serivceRepository: Repository<Serivce>,
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
  ) {}

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
        serName: p.serName,
        packName: p.packName,
        ac: p.ac,
      });
    });

    // 3. Save to database
    return await this.permissionRepository.save(permissions);
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

  async findAll() {
    return await this.userRepository.find({ relations: ['userPermissions'] });
  }

  async findPage(pageNumber: number = 1, pageSize: number = 10) {
    const [data, total] = await this.userRepository.findAndCount({
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

  findOne(id: string) {
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
}
