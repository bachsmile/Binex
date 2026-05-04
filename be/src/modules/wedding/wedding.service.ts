import { Injectable } from '@nestjs/common';
import { CreateWeddingDto } from './dto/wedding/create-wedding.dto';
import { UpdateWeddingDto } from './dto/wedding/update-wedding.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wedding } from './entities/wedding.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class WeddingService {
  constructor(
    @InjectRepository(Wedding)
    private readonly weddingRepository: Repository<Wedding>,
    private readonly userService: UserService,
  ) {}

  async create(createWeddingDto: CreateWeddingDto) {
    if (createWeddingDto.createdBy) {
      const currentCount = await this.weddingRepository.count({
        where: { createdBy: createWeddingDto.createdBy, isDeleted: false },
      });

      const limit = await this.userService.getUserRecordLimit(
        createWeddingDto.createdBy,
        'lm_wedd',
      );

      if (limit > 0 && currentCount >= limit) {
        throw new BadRequestException(
          `Bạn đã đạt giới hạn tối đa số lượng đám cưới được phép tạo (${limit}).`,
        );
      }
    }

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
