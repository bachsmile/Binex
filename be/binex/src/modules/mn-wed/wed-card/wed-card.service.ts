import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WedCard } from './entities/wed-card.entity';
import { Wed } from '../wed/entities/wed.entity';
import { CreateWedCardDto } from './dto/create-wed-card.dto';
import { UpdateWedCardDto } from './dto/update-wed-card.dto';

@Injectable()
export class WedCardService {
  constructor(
    @InjectRepository(WedCard)
    private readonly wedCardRepository: Repository<WedCard>,
    @InjectRepository(Wed)
    private readonly wedRepository: Repository<Wed>,
  ) {}

  async create(createWedCardDto: CreateWedCardDto) {
    return await this.wedCardRepository.manager.transaction(async (manager) => {
      // 1. Tìm tiệc cưới tương ứng
      const wed = await manager.findOne(Wed, {
        where: { id: createWedCardDto.wedId },
      });
      if (!wed) {
        throw new NotFoundException(
          'Không tìm thấy tiệc cưới (Wedding) tương ứng',
        );
      }

      // 2. Nếu tiệc cưới đã có thiệp trước đó, gỡ bỏ và xóa thiệp cũ để tránh rác DB
      if (wed.cardId) {
        const oldCardId = wed.cardId;
        wed.cardId = null;
        await manager.save(Wed, wed);
        await manager.delete(WedCard, { id: oldCardId });
      }

      // 3. Tạo thiệp mới
      const wedCard = manager.create(WedCard, createWedCardDto);
      const savedCard = await manager.save(WedCard, wedCard);

      // 4. Liên kết ngược lại cardId vào bảng Wed
      wed.cardId = savedCard.id;
      await manager.save(Wed, wed);

      return savedCard;
    });
  }

  async findAll() {
    return await this.wedCardRepository.find({
      relations: ['wed'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const card = await this.wedCardRepository.findOne({
      where: { id },
      relations: ['wed'],
    });
    if (!card) {
      throw new NotFoundException('Không tìm thấy thiệp cưới này');
    }
    return card;
  }

  async update(id: string, updateWedCardDto: UpdateWedCardDto) {
    const card = await this.findOne(id);
    Object.assign(card, updateWedCardDto);
    return await this.wedCardRepository.save(card);
  }

  async remove(id: string) {
    const card = await this.findOne(id);
    await this.wedCardRepository.manager.transaction(async (manager) => {
      // Gỡ liên kết trong bảng Wed trước khi xóa cứng thiệp cưới
      await manager.update(Wed, { cardId: id }, { cardId: null });
      await manager.remove(WedCard, card);
    });
    return { success: true, message: 'Xóa thiệp cưới thành công' };
  }
}
