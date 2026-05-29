import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WedWeb } from './entities/wed-web.entity';
import { Wed } from '../wed/entities/wed.entity';
import { CreateWedWebDto } from './dto/create-wed-web.dto';
import { UpdateWedWebDto } from './dto/update-wed-web.dto';

@Injectable()
export class WedWebService {
  constructor(
    @InjectRepository(WedWeb)
    private readonly wedWebRepository: Repository<WedWeb>,
    @InjectRepository(Wed)
    private readonly wedRepository: Repository<Wed>,
  ) {}

  async create(createWedWebDto: CreateWedWebDto, userId?: string) {
    return await this.wedWebRepository.manager.transaction(async (manager) => {
      // 1. Tìm tiệc cưới tương ứng
      const wed = await manager.findOne(Wed, {
        where: { id: createWedWebDto.wedId },
      });
      if (!wed) {
        throw new NotFoundException('Không tìm thấy tiệc cưới (Wedding) tương ứng');
      }

      // 2. Nếu tiệc cưới đã có website trước đó, gỡ bỏ và xóa website cũ để tránh rác DB
      if (wed.webId) {
        const oldWebId = wed.webId;
        wed.webId = null;
        await manager.save(Wed, wed);
        await manager.delete(WedWeb, { id: oldWebId });
      }

      // 3. Tạo website mới
      const wedWeb = manager.create(WedWeb, createWedWebDto);
      if (userId) {
        wedWeb.updatedBy = userId;
      }
      const savedWeb = await manager.save(WedWeb, wedWeb);

      // 4. Liên kết ngược lại webId vào bảng Wed
      wed.webId = savedWeb.id;
      await manager.save(Wed, wed);

      return savedWeb;
    });
  }

  async findAll() {
    return await this.wedWebRepository.find({
      relations: ['wed'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const web = await this.wedWebRepository.findOne({
      where: { id },
      relations: ['wed'],
    });
    if (!web) {
      throw new NotFoundException('Không tìm thấy website tiệc cưới này');
    }
    return web;
  }

  async update(id: string, updateWedWebDto: UpdateWedWebDto, userId?: string) {
    const web = await this.findOne(id);
    Object.assign(web, {
      ...updateWedWebDto,
      updatedBy: userId || null,
    });
    return await this.wedWebRepository.save(web);
  }

  async remove(id: string) {
    const web = await this.findOne(id);
    await this.wedWebRepository.manager.transaction(async (manager) => {
      // Gỡ liên kết trong bảng Wed trước khi xóa cứng website
      await manager.update(Wed, { webId: id }, { webId: null });
      await manager.remove(WedWeb, web);
    });
    return { success: true, message: 'Xóa website tiệc cưới thành công' };
  }
}
