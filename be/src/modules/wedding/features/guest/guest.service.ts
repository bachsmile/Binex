import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest, GuestSide, GuestStatus } from '../../entities/guest.entity';
import { Wedding } from '../../entities/wedding.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { UserService } from '../../../user/user.service';
import * as XLSX from 'xlsx';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    @InjectRepository(Wedding)
    private readonly weddingRepository: Repository<Wedding>,
    private readonly userService: UserService,
  ) {}

  async create(createGuestDto: CreateGuestDto) {
    const wedding = await this.weddingRepository.findOne({
      where: { id: createGuestDto.weddingId },
    });
    if (!wedding) throw new NotFoundException('Wedding not found');

    // Kiểm tra giới hạn khách mời
    if (wedding.createdBy) {
      const currentCount = await this.guestRepository.count({
        where: { weddingId: wedding.id },
      });

      const limit = await this.userService.getUserRecordLimit(
        wedding.createdBy,
        'lm_guest',
      );

      if (limit > 0 && currentCount >= limit) {
        throw new BadRequestException(
          `Bạn đã đạt giới hạn tối đa số lượng khách mời được phép thêm cho đám cưới này (${limit}).`,
        );
      }
    }

    const guest = this.guestRepository.create({
      ...createGuestDto,
      token: Math.random().toString(36).substring(2, 15), // Tạo token ngẫu nhiên cho link invitation
    });
    return await this.guestRepository.save(guest);
  }

  async importGuests(weddingId: string, fileBuffer: Buffer) {
    const wedding = await this.weddingRepository.findOne({
      where: { id: weddingId },
    });
    if (!wedding) throw new NotFoundException('Wedding not found');

    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      throw new BadRequestException('File excel không có dữ liệu');
    }

    // Kiểm tra giới hạn
    if (wedding.createdBy) {
      const currentCount = await this.guestRepository.count({
        where: { weddingId: wedding.id },
      });
      const limit = await this.userService.getUserRecordLimit(
        wedding.createdBy,
        'lm_guest',
      );

      if (limit > 0 && currentCount + data.length > limit) {
        throw new BadRequestException(
          `Số lượng khách nhập vào (${data.length}) vượt quá giới hạn còn lại của bạn (Cấp phép: ${limit}, Hiện có: ${currentCount}).`,
        );
      }
    }

    const guests = data.map((item: any) => {
      // Chuẩn hóa side
      let side = GuestSide.GROOM;
      const rawSide = (item['Phía'] || item['side'] || '')
        .toString()
        .toLowerCase();
      if (rawSide.includes('gái') || rawSide.includes('bride')) {
        side = GuestSide.BRIDE;
      }

      return this.guestRepository.create({
        fullName: item['Họ tên'] || item['fullName'] || 'Khách mời',
        phone: (item['Số điện thoại'] || item['phone'] || '').toString(),
        email: item['Email'] || item['email'],
        address: item['Địa chỉ'] || item['address'],
        note: item['Ghi chú'] || item['note'],
        adultCount: parseInt(item['Người lớn'] || item['adultCount']) || 1,
        childrenCount: parseInt(item['Trẻ em'] || item['childrenCount']) || 0,
        side,
        status: GuestStatus.PENDING,
        token: Math.random().toString(36).substring(2, 15),
        weddingId,
      });
    });

    return await this.guestRepository.save(guests);
  }

  async findAll(weddingId: string) {
    return await this.guestRepository.find({
      where: { weddingId },
      order: { side: 'ASC', fullName: 'ASC' },
    });
  }

  async findOne(id: string) {
    const guest = await this.guestRepository.findOne({ where: { id } });
    if (!guest) throw new NotFoundException('Guest not found');
    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto) {
    const guest = await this.findOne(id);
    Object.assign(guest, updateGuestDto);
    return await this.guestRepository.save(guest);
  }

  async remove(id: string) {
    const guest = await this.findOne(id);
    return await this.guestRepository.remove(guest);
  }
}
