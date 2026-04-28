import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeddingPackage } from './entities/wedding-package.entity';
import { CreateWeddingPackageDto } from './dto/create-wedding-package.dto';
import { UpdateWeddingPackageDto } from './dto/update-wedding-package.dto';

@Injectable()
export class WeddingPackageService {
  create(createWeddingPackageDto: CreateWeddingPackageDto) {
    const weddingPackage = this.weddingPackageRepository.create(
      createWeddingPackageDto,
    );
    return this.weddingPackageRepository.save(weddingPackage);
  }

  findAll() {
    return this.weddingPackageRepository.find();
  }

  async findOne(id: string) {
    const weddingPackage = await this.weddingPackageRepository.findOne({
      where: { id },
    });
    if (!weddingPackage) {
      throw new NotFoundException(`Không tìm thấy gói dịch vụ với ID: ${id}`);
    }
    return weddingPackage;
  }

  async update(id: string, updateWeddingPackageDto: UpdateWeddingPackageDto) {
    const weddingPackage = await this.findOne(id);
    const updated = Object.assign(weddingPackage, updateWeddingPackageDto);
    return this.weddingPackageRepository.save(updated);
  }

  async remove(id: string) {
    const weddingPackage = await this.findOne(id);
    return this.weddingPackageRepository.remove(weddingPackage);
  }
}
