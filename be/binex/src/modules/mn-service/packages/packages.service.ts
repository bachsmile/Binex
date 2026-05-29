import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Repository } from 'typeorm';
import { Sv_Pk } from '../service/entities/sv-pk.entity';
import { PK_Micro } from './entities/pk-micro';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Sv_Pk)
    private readonly svPkRepository: Repository<Sv_Pk>,
    @InjectRepository(PK_Micro)
    private readonly pkMicroRepository: Repository<PK_Micro>,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const checkCode = await this.packageRepository.findOne({
      where: { code: createPackageDto.code },
    });
    if (checkCode) {
      throw new Error('Code đã tồn tại');
    }
    const newPackage = this.packageRepository.create(createPackageDto);
    return await this.packageRepository.save(newPackage);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [result, total] = await this.packageRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
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

  findOne(id: string) {
    return this.packageRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const checkCode = await this.packageRepository.findOne({
      where: { id },
    });
    if (!checkCode) {
      throw new Error('Không tìm thấy gói');
    }
    const updatePackage = this.packageRepository.merge(
      checkCode,
      updatePackageDto,
    );
    return await this.packageRepository.save(updatePackage);
  }

  async remove(id: string) {
    const checkCode = await this.packageRepository.findOne({
      where: { id },
    });
    if (!checkCode) {
      throw new Error('Không tìm thấy gói');
    }
    return await this.packageRepository.remove(checkCode);
  }

  async findServicesByPackage(packageId: string) {
    const relations = await this.svPkRepository.find({
      where: { packageId },
      relations: ['service'],
    });
    return relations.map((r) => r.service);
  }

  async updateMicroServices(packageId: string, microIds: string[]) {
    // 1. Xóa các quan hệ cũ trong bảng pk_micro cho packageId này
    await this.pkMicroRepository.delete({ packageId });

    // 2. Thêm mới các quan hệ nếu có danh sách microIds
    if (microIds && microIds.length > 0) {
      const pkMicros = microIds.map((microId) =>
        this.pkMicroRepository.create({ packageId, microId }),
      );
      await this.pkMicroRepository.save(pkMicros);
    }

    return {
      success: true,
      message: 'Cập nhật microservice cho package thành công',
    };
  }

  async findMicroServicesByPackage(packageId: string) {
    const relations = await this.pkMicroRepository.find({
      where: { packageId },
      relations: ['micro'],
    });
    return relations.map((r) => r.micro);
  }

  async findAllWithMicroServices() {
    const packages = await this.packageRepository.find();

    // Load all pk_micro relations
    const pkMicros = await this.pkMicroRepository.find({
      relations: ['micro'],
    });

    // Group micros by packageId
    const packageMicrosMap = new Map<string, any[]>();
    pkMicros.forEach((pm) => {
      if (pm.micro) {
        const list = packageMicrosMap.get(pm.packageId) || [];
        list.push(pm.micro);
        packageMicrosMap.set(pm.packageId, list);
      }
    });

    // Map micros to packages
    return packages.map((pkg) => ({
      ...pkg,
      microservices: packageMicrosMap.get(pkg.id) || [],
    }));
  }
}
