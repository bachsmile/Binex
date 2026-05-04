import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/service/create-service.dto';
import { UpdateServiceDto } from './dto/service/update-service.dto';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  create(createServiceDto: CreateServiceDto) {
    const service = this.serviceRepository.create(createServiceDto);
    service.createdAt = new Date();
    service.updatedAt = new Date();
    return this.serviceRepository.save(service);
  }

  findAll() {
    return this.serviceRepository.find();
  }

  findOne(id: string) {
    return this.serviceRepository.findOne({ where: { id } });
  }

  findByUserId(userId: string) {
    return `This action returns a #${userId} service`;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error('Service not found');
    }
    const updatedService = this.serviceRepository.merge(
      service,
      updateServiceDto,
    );
    updatedService.updatedAt = new Date();

    return this.serviceRepository.save(updatedService);
  }

  async remove(id: string) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error('Service not found');
    }
    return this.serviceRepository.remove(service);
  }
}
