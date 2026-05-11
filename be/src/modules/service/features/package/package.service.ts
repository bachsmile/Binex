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

    const pack = this.packageRepository.create(createPackageDto);
    pack.createdAt = new Date();
    pack.updatedAt = new Date();
    pack.amountGroup = createPackageDto.isGroup ? 5 : 1;

    const savedPackage = await this.packageRepository.save(pack);

    // Automatically link to service if serviceId is provided
    if (createPackageDto.serviceId) {
      console.log(`[PackageService] Linking package ${savedPackage.id} to service ${createPackageDto.serviceId}`);
      
      const service = await this.serviceRepository.findOne({
        where: { id: createPackageDto.serviceId },
      });

      if (service) {
        const packageIds = service.packageIds || [];
        if (!packageIds.includes(savedPackage.id)) {
          packageIds.push(savedPackage.id);
          // Force a new array reference for TypeORM to detect changes
          service.packageIds = [...packageIds];
          service.updatedAt = new Date();
          
          const updatedService = await this.serviceRepository.save(service);
          console.log(`[PackageService] Successfully updated service ${service.id}. New packageIds:`, updatedService.packageIds);
        } else {
          console.log(`[PackageService] Package ID already exists in service ${service.id}`);
        }
      } else {
        console.warn(`[PackageService] Service with ID ${createPackageDto.serviceId} not found!`);
      }
    }

    return savedPackage;
  }

  findAll() {
    return this.packageRepository.find();
  }

  findOne(id: string) {
    return this.packageRepository.findOne({ where: { id } });
  }

  findByIds(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    return this.packageRepository.find({ where: { id: In(ids) } });
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const pack = await this.packageRepository.findOne({
      where: { id },
    });
    if (!pack) {
      throw new Error('Package not found');
    }
    const updatedPack = this.packageRepository.merge(pack, updatePackageDto);
    updatedPack.amountGroup = updatedPack.isGroup ? 5 : 1;
    updatedPack.updatedAt = new Date();
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
