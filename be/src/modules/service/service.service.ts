import { Injectable, Logger } from '@nestjs/common';
import { CreateServiceDto } from './dto/service/create-service.dto';
import { UpdateServiceDto } from './dto/service/update-service.dto';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiceService {
  private readonly logger = new Logger(ServiceService.name);

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

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.serviceRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { priority: 'ASC', createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string) {
    return this.serviceRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
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
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!service) {
      throw new Error('Service not found');
    }
    return this.serviceRepository.remove(service);
  }

  async findAllServices() {
    return this.serviceRepository.find({ order: { priority: 'ASC' } });
  }
}
