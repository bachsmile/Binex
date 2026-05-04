import { Injectable } from '@nestjs/common';
import { CreateWeddingDto } from './dto/wedding/create-wedding.dto';
import { UpdateWeddingDto } from './dto/wedding/update-wedding.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wedding } from './entities/wedding.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WeddingService {
  constructor(
    @InjectRepository(Wedding)
    private readonly weddingRepository: Repository<Wedding>,
  ) {}

  create(createWeddingDto: CreateWeddingDto) {
    const wedding = this.weddingRepository.create(createWeddingDto);
    return this.weddingRepository.save(wedding);
  }

  findAll() {
    return this.weddingRepository.find();
  }

  async findOne(id: string) {
    return this.weddingRepository.findOne({ where: { id } });
  }

  async update(id: string, updateWeddingDto: UpdateWeddingDto) {
    await this.weddingRepository.update(id, updateWeddingDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.weddingRepository.delete(id);
    return { deleted: true };
  }
}
