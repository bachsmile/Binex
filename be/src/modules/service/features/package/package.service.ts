import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePackageDto } from '../../dto/package/create-package.dto';
import { UpdatePackageDto } from '../../dto/package/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from '../../entities/package.entity';
import { Service } from '../../entities/service.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    const existingPackage = await this.packageRepository.findOne({
      where: { name: createPackageDto.name },
    });

    if (existingPackage) {
      throw new ConflictException('Package name already exists');
    }

    const { serviceIds, serviceId, ...dto } = createPackageDto;
    void serviceId;

    const pack = this.packageRepository.create(dto);
    pack.createdAt = new Date();
    pack.updatedAt = new Date();
    pack.amountGroup = createPackageDto.isGroup ? 5 : 1;

    const selectedServiceIds = serviceIds;

    if (selectedServiceIds && selectedServiceIds.length > 0) {
      const services = await this.serviceRepository.find({
        where: { id: In(selectedServiceIds) },
      });
      pack.services = services;
    } else {
      pack.services = [];
    }

    return this.packageRepository.save(pack);
  }

  findAll() {
    return this.packageRepository.find({ relations: ['services'] });
  }

  findOne(id: string) {
    return this.packageRepository.findOne({
      where: { id },
      relations: ['services'],
    });
  }

  findByIds(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    return this.packageRepository.find({
      where: { id: In(ids) },
      relations: ['services'],
    });
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const pack = await this.packageRepository.findOne({
      where: { id },
      relations: ['services'],
    });
    if (!pack) {
      throw new Error('Package not found');
    }

    const { serviceIds, serviceId, ...dto } = updatePackageDto;
    void serviceId;

    const updatedPack = this.packageRepository.merge(pack, dto);
    updatedPack.amountGroup = updatedPack.isGroup ? 5 : 1;
    updatedPack.updatedAt = new Date();

    const selectedServiceIds = serviceIds;

    if (selectedServiceIds) {
      if (selectedServiceIds.length > 0) {
        const services = await this.serviceRepository.find({
          where: { id: In(selectedServiceIds) },
        });
        updatedPack.services = services;
      } else {
        updatedPack.services = [];
      }
    }

    return this.packageRepository.save(updatedPack);
  }

  async remove(id: string) {
    const pack = await this.packageRepository.findOne({ where: { id } });
    if (!pack) {
      throw new Error('Package not found');
    }
    return this.packageRepository.remove(pack);
  }

  async removeAll() {
    return this.packageRepository.createQueryBuilder().delete().execute();
  }

  async updateRecordLimit(id: string, key: string, value: number) {
    const pack = await this.packageRepository.findOne({ where: { id } });
    if (!pack) {
      throw new Error('Package not found');
    }

    const recordLimit = pack.recordLimit || {};
    recordLimit[key] = value;
    pack.recordLimit = recordLimit;
    pack.updatedAt = new Date();

    return this.packageRepository.save(pack);
  }
}
