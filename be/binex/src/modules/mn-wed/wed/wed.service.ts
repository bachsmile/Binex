import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wed } from './entities/wed.entity';
import { CreateWedDto } from './dto/create-wed.dto';
import { UpdateWedDto } from './dto/update-wed.dto';

@Injectable()
export class WedService {
  constructor(
    @InjectRepository(Wed)
    private readonly wedRepository: Repository<Wed>,
  ) {}

  async create(createWedDto: CreateWedDto, userId: string) {
    const wed = this.wedRepository.create({
      ...createWedDto,
      userId,
    });
    return await this.wedRepository.save(wed);
  }

  async findAll(userId: string) {
    const whereCondition = { userId };
    return await this.wedRepository.find({
      where: whereCondition,
      relations: ['web', 'card'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const wed = await this.wedRepository.findOne({
      where: { id },
      relations: ['web', 'card', 'participants'],
    });
    if (!wed) {
      throw new NotFoundException('Không tìm thấy tiệc cưới (Wedding) này');
    }
    return wed;
  }

  async update(id: string, updateWedDto: UpdateWedDto) {
    const wed = await this.findOne(id);
    Object.assign(wed, updateWedDto);
    return await this.wedRepository.save(wed);
  }

  async remove(id: string) {
    const wed = await this.findOne(id);
    return await this.wedRepository.remove(wed);
  }
}
