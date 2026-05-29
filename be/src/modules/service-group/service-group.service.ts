import { Injectable, Logger } from '@nestjs/common';
import { CreateServiceGroupDto } from './dto/create-service-group.dto';
import { UpdateServiceGroupDto } from './dto/update-service-group.dto';
import { Repository } from 'typeorm';
import { ServiceGroup } from './entities/service-group.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiceGroupService {
  private readonly logger = new Logger(ServiceGroupService.name);

  constructor(
    @InjectRepository(ServiceGroup)
    private readonly serviceGroupRepository: Repository<ServiceGroup>,
  ) {}

  create(createDto: CreateServiceGroupDto) {
    const serviceGroup = this.serviceGroupRepository.create(createDto);
    serviceGroup.createdAt = new Date();
    serviceGroup.updatedAt = new Date();
    return this.serviceGroupRepository.save(serviceGroup);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.serviceGroupRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { priority: 'ASC', createdAt: 'DESC' },
    });

    const mappedData = data.map((service) => {
      (service as any).packageIds = [];
      return service;
    });

    return { data: mappedData, total };
  }

  async findOne(id: string) {
    const service = await this.serviceGroupRepository.findOne({
      where: { id },
    });
    if (service) {
      (service as any).packageIds = [];
    }
    return service;
  }

  findByUserId(userId: string) {
    return `This action returns a #${userId} service group`;
  }

  async update(id: string, updateDto: UpdateServiceGroupDto) {
    const service = await this.serviceGroupRepository.findOne({
      where: { id },
    });
    if (!service) {
      throw new Error('Service group not found');
    }
    const updatedService = this.serviceGroupRepository.merge(
      service,
      updateDto,
    );
    updatedService.updatedAt = new Date();

    return this.serviceGroupRepository.save(updatedService);
  }

  async remove(id: string) {
    const service = await this.serviceGroupRepository.findOne({
      where: { id },
    });
    if (!service) {
      throw new Error('Service group not found');
    }
    return this.serviceGroupRepository.remove(service);
  }
}
