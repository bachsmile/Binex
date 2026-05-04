import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LimitType } from './entities/limit-type.entity';

@Injectable()
export class LimitTypeService {
  constructor(
    @InjectRepository(LimitType)
    private readonly limitTypeRepository: Repository<LimitType>,
  ) {}

  async create(data: Partial<LimitType>) {
    const limitType = this.limitTypeRepository.create(data);
    return await this.limitTypeRepository.save(limitType);
  }

  async findAll() {
    return await this.limitTypeRepository.find({ order: { key: 'ASC' } });
  }

  async findOne(id: number) {
    const limitType = await this.limitTypeRepository.findOne({ where: { id } });
    if (!limitType) throw new NotFoundException('Limit type not found');
    return limitType;
  }

  async update(id: number, data: Partial<LimitType>) {
    const limitType = await this.findOne(id);
    Object.assign(limitType, data);
    return await this.limitTypeRepository.save(limitType);
  }

  async remove(id: number) {
    const limitType = await this.findOne(id);
    return await this.limitTypeRepository.remove(limitType);
  }
}
