import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWedMapTableDto } from './dto/create-wed-map-table.dto';
import { UpdateWedMapTableDto } from './dto/update-wed-map-table.dto';
import { AssignParticipantDto } from './dto/assign-participant.dto';
import { WedMapTable } from './entities/wed-map-table.entity';
import { WedParticipant } from '../wed-participants/entities/wed-participant.entity';
import { Wed } from '../wed/entities/wed.entity';

@Injectable()
export class WedMapTableService {
  constructor(
    @InjectRepository(WedMapTable)
    private readonly wedMapTableRepository: Repository<WedMapTable>,
    @InjectRepository(WedParticipant)
    private readonly wedParticipantRepository: Repository<WedParticipant>,
    @InjectRepository(Wed)
    private readonly wedRepository: Repository<Wed>,
  ) {}

  async create(createWedMapTableDto: CreateWedMapTableDto) {
    const { wedId, name, areaName, maxSeats, note } = createWedMapTableDto;

    // Kiểm tra tiệc cưới có tồn tại hay không
    const wed = await this.wedRepository.findOne({ where: { id: wedId } });
    if (!wed) {
      throw new NotFoundException('Không tìm thấy tiệc cưới tương ứng');
    }

    const table = this.wedMapTableRepository.create({
      name,
      areaName,
      maxSeats: maxSeats ?? 10,
      currentSeats: 0,
      status: 'available',
      note,
      wedId,
    });

    return await this.wedMapTableRepository.save(table);
  }

  async findAll(wedId?: string) {
    const whereCondition = wedId ? { wedId } : {};
    return await this.wedMapTableRepository.find({
      where: whereCondition,
      relations: ['participants'],
      order: { areaName: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const table = await this.wedMapTableRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!table) {
      throw new NotFoundException('Không tìm thấy bàn tiệc này');
    }

    return table;
  }

  async update(id: string, updateWedMapTableDto: UpdateWedMapTableDto) {
    const table = await this.findOne(id);

    // Cập nhật thông tin bàn tiệc
    Object.assign(table, updateWedMapTableDto);

    // Nếu thay đổi sức chứa maxSeats, kiểm tra lại trạng thái
    if (table.currentSeats >= table.maxSeats) {
      table.status = 'full';
    } else {
      table.status = 'available';
    }

    return await this.wedMapTableRepository.save(table);
  }

  async remove(id: string) {
    const table = await this.findOne(id);

    await this.wedMapTableRepository.manager.transaction(async (manager) => {
      // Giải phóng tất cả khách mời đang ngồi ở bàn này
      const participants = await manager.find(WedParticipant, {
        where: { tableId: id },
      });

      for (const participant of participants) {
        participant.tableId = null;
        await manager.save(WedParticipant, participant);
      }

      // Xóa bàn tiệc
      await manager.softRemove(table);
    });

    return {
      success: true,
      message: 'Xóa bàn tiệc và giải phóng khách mời thành công',
    };
  }

  async assignSeat(dto: AssignParticipantDto) {
    return await this.wedMapTableRepository.manager.transaction(
      async (manager) => {
        const participant = await manager.findOne(WedParticipant, {
          where: { id: dto.participantId },
        });

        if (!participant) {
          throw new NotFoundException('Không tìm thấy khách mời');
        }

        const seatsNeeded = participant.adultCount || 1;

        // 1. Trường hợp giải phóng bàn (hủy xếp ghế)
        if (!dto.tableId) {
          if (participant.tableId) {
            const oldTable = await manager.findOne(WedMapTable, {
              where: { id: participant.tableId },
            });

            if (oldTable) {
              oldTable.currentSeats = Math.max(
                0,
                oldTable.currentSeats - seatsNeeded,
              );
              oldTable.status =
                oldTable.currentSeats >= oldTable.maxSeats
                  ? 'full'
                  : 'available';
              await manager.save(WedMapTable, oldTable);
            }

            participant.tableId = null;
            await manager.save(WedParticipant, participant);
          }

          return {
            success: true,
            message: 'Đã giải phóng chỗ ngồi của khách mời',
          };
        }

        // 2. Trường hợp xếp khách vào bàn mới hoặc đổi bàn
        if (participant.tableId === dto.tableId) {
          return { success: true, message: 'Khách mời đã ở bàn này rồi' };
        }

        const targetTable = await manager.findOne(WedMapTable, {
          where: { id: dto.tableId },
        });

        if (!targetTable) {
          throw new NotFoundException('Không tìm thấy bàn tiệc đích');
        }

        if (targetTable.wedId !== participant.wedId) {
          throw new BadRequestException(
            'Khách mời và bàn tiệc phải thuộc cùng một tiệc cưới',
          );
        }

        // Kiểm tra sức chứa bàn đích
        if (targetTable.currentSeats + seatsNeeded > targetTable.maxSeats) {
          throw new BadRequestException(
            `Bàn tiệc đã hết chỗ cho số lượng khách này (Tối đa: ${targetTable.maxSeats}, Đã ngồi: ${targetTable.currentSeats}, Cần thêm: ${seatsNeeded})`,
          );
        }

        // Nếu khách đang ở bàn cũ, giảm currentSeats ở bàn cũ
        if (participant.tableId) {
          const oldTable = await manager.findOne(WedMapTable, {
            where: { id: participant.tableId },
          });

          if (oldTable) {
            oldTable.currentSeats = Math.max(
              0,
              oldTable.currentSeats - seatsNeeded,
            );
            oldTable.status =
              oldTable.currentSeats >= oldTable.maxSeats ? 'full' : 'available';
            await manager.save(WedMapTable, oldTable);
          }
        }

        // Tăng currentSeats ở bàn mới
        targetTable.currentSeats += seatsNeeded;
        targetTable.status =
          targetTable.currentSeats >= targetTable.maxSeats
            ? 'full'
            : 'available';
        await manager.save(WedMapTable, targetTable);

        // Cập nhật tableId của khách mời
        participant.tableId = targetTable.id;
        const savedParticipant = await manager.save(
          WedParticipant,
          participant,
        );

        return {
          success: true,
          message: `Xếp chỗ thành công vào ${targetTable.name} (Khu vực: ${targetTable.areaName})`,
          participant: savedParticipant,
          table: targetTable,
        };
      },
    );
  }
}
