import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePackageDto } from '../../dto/package/create-package.dto';
import { UpdatePackageDto } from '../../dto/package/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from '../../entities/package.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
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

    return this.packageRepository.save(pack);
  }

  findAll() {
    return this.packageRepository.find();
  }

  findOne(id: string) {
    return this.packageRepository.findOne({ where: { id } });
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
}
