import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WdCard } from '../../entities/wd-card.entity';
import { CreateWdCardDto } from '../../dto/card/create-wd-card.dto';
import { UpdateWdCardDto } from '../../dto/card/update-wd-card.dto';

@Injectable()
export class WdCardService {
  constructor(
    @InjectRepository(WdCard)
    private readonly wdCardRepository: Repository<WdCard>,
  ) {}

  async create(createWdCardDto: CreateWdCardDto, userId: string) {
    const wdCard = this.wdCardRepository.create(createWdCardDto);
    wdCard.userId = userId;
    if (!wdCard.createdAt) {
      wdCard.createdAt = new Date();
    }
    return this.wdCardRepository.save(wdCard);
  }

  findAll() {
    return this.wdCardRepository.find({
      relations: ['user', 'wedding'],
    });
  }

  async findOne(id: string) {
    const wdCard = await this.wdCardRepository.findOne({
      where: { id },
      relations: ['user', 'wedding'],
    });
    if (!wdCard) {
      throw new NotFoundException(`WdCard with ID ${id} not found`);
    }
    return wdCard;
  }

  async update(id: string, updateWdCardDto: UpdateWdCardDto) {
    const wdCard = await this.findOne(id);
    Object.assign(wdCard, updateWdCardDto);
    return this.wdCardRepository.save(wdCard);
  }

  async remove(id: string) {
    const wdCard = await this.findOne(id);
    await this.wdCardRepository.remove(wdCard);
    return { deleted: true };
  }
}
