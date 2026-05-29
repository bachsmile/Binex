import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WedParticipant } from './entities/wed-participant.entity';
import { Wed } from '../wed/entities/wed.entity';
import { CreateWedParticipantDto } from './dto/create-wed-participant.dto';
import { UpdateWedParticipantDto } from './dto/update-wed-participant.dto';
import { ParticipantSide } from './enum/participant.enum';
import * as XLSX from 'xlsx';

@Injectable()
export class WedParticipantsService {
  constructor(
    @InjectRepository(WedParticipant)
    private readonly wedParticipantRepository: Repository<WedParticipant>,
    @InjectRepository(Wed)
    private readonly wedRepository: Repository<Wed>,
  ) {}

  async create(createWedParticipantDto: CreateWedParticipantDto) {
    return await this.wedParticipantRepository.manager.transaction(
      async (manager) => {
        // 1. Tìm đám cưới tương ứng
        const wed = await manager.findOne(Wed, {
          where: { id: createWedParticipantDto.wedId },
        });
        if (!wed) {
          throw new NotFoundException(
            'Không tìm thấy tiệc cưới (Wedding) tương ứng',
          );
        }

        // 2. Tạo khách mời
        const participant = manager.create(
          WedParticipant,
          createWedParticipantDto,
        );

        // Tạo token ngẫu nhiên cho link xác nhận nếu chưa có
        if (!participant.token) {
          participant.token =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        }

        const savedParticipant = await manager.save(
          WedParticipant,
          participant,
        );

        // 3. Cập nhật số lượng khách mời (guestCount) của đám cưới
        const totalGuests = await manager.count(WedParticipant, {
          where: { wedId: createWedParticipantDto.wedId },
        });
        wed.guestCount = totalGuests;
        await manager.save(Wed, wed);

        return savedParticipant;
      },
    );
  }

  async findAll(wedId?: string) {
    const whereCondition = wedId ? { wedId } : {};
    return await this.wedParticipantRepository.find({
      where: whereCondition,
      relations: ['wed'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const participant = await this.wedParticipantRepository.findOne({
      where: { id },
      relations: ['wed'],
    });
    if (!participant) {
      throw new NotFoundException('Không tìm thấy khách mời này');
    }
    return participant;
  }

  async update(id: string, updateWedParticipantDto: UpdateWedParticipantDto) {
    const participant = await this.findOne(id);
    Object.assign(participant, updateWedParticipantDto);
    return await this.wedParticipantRepository.save(participant);
  }

  async updateGiftMoney(id: string, giftMoney: number) {
    const participant = await this.findOne(id);
    participant.giftMoney = giftMoney;
    return await this.wedParticipantRepository.save(participant);
  }

  async remove(id: string) {
    const participant = await this.findOne(id);
    const wedId = participant.wedId;

    await this.wedParticipantRepository.manager.transaction(async (manager) => {
      await manager.remove(WedParticipant, participant);

      // Cập nhật số lượng khách mời còn lại của đám cưới
      const wed = await manager.findOne(Wed, { where: { id: wedId } });
      if (wed) {
        const totalGuests = await manager.count(WedParticipant, {
          where: { wedId },
        });
        wed.guestCount = totalGuests;
        await manager.save(Wed, wed);
      }
    });

    return { success: true, message: 'Xóa khách mời thành công' };
  }

  async importExcel(file: Express.Multer.File, wedId: string) {
    if (!file) {
      throw new BadRequestException('Vui lòng tải lên tệp excel');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const rows = XLSX.utils.sheet_to_json(sheet) as any[];

    const participantsToSave: WedParticipant[] = [];

    await this.wedParticipantRepository.manager.transaction(async (manager) => {
      const wed = await manager.findOne(Wed, { where: { id: wedId } });
      if (!wed) {
        throw new NotFoundException(
          'Không tìm thấy tiệc cưới (Wedding) tương ứng',
        );
      }

      for (const row of rows) {
        const fullName = row['Họ tên *'] || row['Họ tên'];
        if (!fullName) continue;

        const phone = row['Số điện thoại']
          ? String(row['Số điện thoại'])
          : null;
        const email = row['Email'] || null;

        let side = ParticipantSide.GROOM;
        const rawSide = String(
          row['Phía gia đình (groom/bride)'] || '',
        ).toLowerCase();
        if (rawSide === 'bride' || rawSide === 'nhà gái' || rawSide === 'gái') {
          side = ParticipantSide.BRIDE;
        }

        const address = row['Địa chỉ'] || null;
        const note = row['Ghi chú'] || null;
        const adultCount = Number(row['Số người lớn']) || 1;
        const childrenCount = Number(row['Số trẻ em']) || 0;

        const participant = manager.create(WedParticipant, {
          fullName,
          phone,
          email,
          side,
          address,
          note,
          adultCount,
          childrenCount,
          wedId,
          token:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
        });

        participantsToSave.push(participant);
      }

      if (participantsToSave.length > 0) {
        await manager.save(WedParticipant, participantsToSave);
      }

      const totalGuests = await manager.count(WedParticipant, {
        where: { wedId },
      });
      wed.guestCount = totalGuests;
      await manager.save(Wed, wed);
    });

    return {
      success: true,
      importedCount: participantsToSave.length,
      message: `Đã nhập thành công ${participantsToSave.length} khách mời từ excel`,
    };
  }

  generateTemplate() {
    const headers = [
      'Họ tên *',
      'Số điện thoại',
      'Email',
      'Phía gia đình (groom/bride)',
      'Địa chỉ',
      'Ghi chú',
      'Số người lớn',
      'Số trẻ em',
    ];
    const sampleData = [
      [
        'Nguyễn Văn A',
        '0905123456',
        'nguyenvana@gmail.com',
        'groom',
        'Đà Nẵng',
        'Bạn chú rể',
        1,
        0,
      ],
      [
        'Trần Thị B',
        '0912345678',
        'tranthib@gmail.com',
        'bride',
        'Quảng Nam',
        'Đồng nghiệp cô dâu',
        2,
        1,
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KhachMoi');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }
}
