import { Injectable } from '@nestjs/common';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { UpdateWeddingDto } from './dto/update-wedding.dto';
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
    return this.weddingRepository.save(createWeddingDto);
  }

  findAll() {
    return `This action returns all wedding`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wedding`;
  }

  update(id: number, updateWeddingDto: UpdateWeddingDto) {
    return `This action updates a #${id} wedding`;
  }

  remove(id: number) {
    return `This action removes a #${id} wedding`;
  }
}
