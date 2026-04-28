import { Injectable } from '@nestjs/common';
import { CreateSerivceDto } from './dto/create-serivce.dto';
import { UpdateSerivceDto } from './dto/update-serivce.dto';
import { Repository } from 'typeorm';
import { Serivce } from './entities/serivce.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SerivceService {
  constructor(
    @InjectRepository(Serivce)
    private readonly serivceRepository: Repository<Serivce>,
  ) {}

  create(createSerivceDto: CreateSerivceDto) {
    const serivce = this.serivceRepository.create(createSerivceDto);
    serivce.createdAt = new Date();
    serivce.updatedAt = new Date();
    return this.serivceRepository.save(serivce);
  }

  findAll() {
    const serivce = this.serivceRepository.find();
    return serivce;
  }

  findOne(id: string) {
    return this.serivceRepository.findOne({ where: { id } });
  }

  findByUserId(userId: string) {
    return `This action returns a #${userId} serivce`;
  }

  async update(id: string, updateSerivceDto: UpdateSerivceDto) {
    const serivce = await this.serivceRepository.findOne({ where: { id } });
    if (!serivce) {
      throw new Error('Serivce not found');
    }
    const updatedSer = this.serivceRepository.merge(serivce, updateSerivceDto);
    updatedSer.updatedAt = new Date();

    return this.serivceRepository.save(updatedSer);
  }

  async remove(id: string) {
    const serivce = await this.serivceRepository.findOne({ where: { id } });
    if (!serivce) {
      throw new Error('Serivce not found');
    }
    return this.serivceRepository.remove(serivce);
  }
}
