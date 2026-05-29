import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFiEventDto } from './dto/create-fi-event.dto';
import { UpdateFiEventDto } from './dto/update-fi-event.dto';
import { AddFiEvFeeDto } from './dto/add-fi-ev-fee.dto';
import { AddFiEvTokenDto } from './dto/add-fi-ev-token.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { FiEvent } from './entities/fi-event.entity';
import { FiEvFee } from './entities/fi-ev-fee.entity';
import { FiEvToken } from './entities/fi-ev-token.entity';

@Injectable()
export class FiEventService {
  constructor(
    @InjectRepository(FiEvent)
    private readonly fiEventRepository: Repository<FiEvent>,
    @InjectRepository(FiEvFee)
    private readonly fiEvFeeRepository: Repository<FiEvFee>,
    @InjectRepository(FiEvToken)
    private readonly fiEvTokenRepository: Repository<FiEvToken>,
  ) {}

  async create(createFiEventDto: CreateFiEventDto) {
    const event = this.fiEventRepository.create(createFiEventDto);
    return await this.fiEventRepository.save(event);
  }

  async findAll(startDateStr?: string, endDateStr?: string) {
    const where: any = {};

    if (startDateStr || endDateStr) {
      const start = startDateStr
        ? new Date(startDateStr)
        : new Date('1970-01-01');
      const end = endDateStr ? new Date(endDateStr) : new Date();
      where.createdAt = Between(start, end);
    }

    return await this.fiEventRepository.find({
      where,
      relations: ['fees', 'tokens'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number, startDateStr?: string, endDateStr?: string) {
    // Lọc sự kiện kèm theo điều kiện thời gian cho các bảng liên quan (fees, tokens)
    return await this.fiEventRepository
      .findOne({
        where: { id },
        relations: ['fees', 'tokens'],
        relationLoadStrategy: 'query',
      })
      .then((event) => {
        if (!event) return null;

        let filteredFees = event.fees || [];
        let filteredTokens = event.tokens || [];

        if (startDateStr || endDateStr) {
          const start = startDateStr
            ? new Date(startDateStr)
            : new Date('1970-01-01');
          const end = endDateStr ? new Date(endDateStr) : new Date();

          filteredFees = filteredFees.filter(
            (fee) => fee.createdAt >= start && fee.createdAt <= end,
          );
          filteredTokens = filteredTokens.filter(
            (token) => token.createdAt >= start && token.createdAt <= end,
          );
        }

        return {
          ...event,
          fees: filteredFees,
          tokens: filteredTokens,
        };
      });
  }

  async addFee(id: number, addFiEvFeeDto: AddFiEvFeeDto) {
    const event = await this.fiEventRepository.findOne({ where: { id } });
    if (!event) {
      throw new BadRequestException('Sự kiện không tồn tại');
    }
    const fee = this.fiEvFeeRepository.create({
      ...addFiEvFeeDto,
      eventId: id,
    });
    await this.fiEvFeeRepository.save(fee);
    return this.findOne(id);
  }

  async getFees(id: number, startDateStr?: string, endDateStr?: string) {
    const event = await this.fiEventRepository.findOne({ where: { id } });
    if (!event) {
      throw new BadRequestException('Sự kiện không tồn tại');
    }

    const where: any = { eventId: id };

    if (startDateStr || endDateStr) {
      const start = startDateStr
        ? new Date(startDateStr)
        : new Date('1970-01-01');
      const end = endDateStr ? new Date(endDateStr) : new Date();
      where.createdAt = Between(start, end);
    }

    return await this.fiEvFeeRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async addToken(id: number, addFiEvTokenDto: AddFiEvTokenDto) {
    const event = await this.fiEventRepository.findOne({ where: { id } });
    if (!event) {
      throw new BadRequestException('Sự kiện không tồn tại');
    }
    const token = this.fiEvTokenRepository.create({
      ...addFiEvTokenDto,
      eventId: id,
    });
    await this.fiEvTokenRepository.save(token);
    return this.findOne(id);
  }

  async getTokens(id: number, startDateStr?: string, endDateStr?: string) {
    const event = await this.fiEventRepository.findOne({ where: { id } });
    if (!event) {
      throw new BadRequestException('Sự kiện không tồn tại');
    }

    const where: any = { eventId: id };

    if (startDateStr || endDateStr) {
      const start = startDateStr
        ? new Date(startDateStr)
        : new Date('1970-01-01');
      const end = endDateStr ? new Date(endDateStr) : new Date();
      where.createdAt = Between(start, end);
    }

    return await this.fiEvTokenRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getPoints(id: number, startDateStr?: string, endDateStr?: string) {
    const event = await this.fiEventRepository.findOne({ where: { id } });
    if (!event) {
      throw new BadRequestException('Sự kiện không tồn tại');
    }

    let start: Date;
    let end: Date;

    if (startDateStr) {
      start = new Date(startDateStr);
    } else {
      start = new Date();
      start.setMonth(start.getMonth() - 1); // default last 1 month
    }

    if (endDateStr) {
      end = new Date(endDateStr);
    } else {
      end = new Date();
    }

    const fees = await this.fiEvFeeRepository.find({
      where: {
        eventId: id,
        createdAt: Between(start, end),
      },
    });

    const tokens = await this.fiEvTokenRepository.find({
      where: {
        eventId: id,
        createdAt: Between(start, end),
      },
    });

    const totalFeePoints = fees.reduce(
      (sum, item) => sum + (Number(item.point) || 0),
      0,
    );
    const totalTokenPoints = tokens.reduce(
      (sum, item) => sum + (Number(item.point) || 0),
      0,
    );

    return {
      eventId: id,
      startDate: start,
      endDate: end,
      totalFeePoints,
      totalTokenPoints,
      netPoints: totalFeePoints - totalTokenPoints,
    };
  }

  async getProfit(id: number, startDateStr?: string, endDateStr?: string) {
    const event = await this.fiEventRepository.findOne({ where: { id } });
    if (!event) {
      throw new BadRequestException('Sự kiện không tồn tại');
    }

    let start: Date;
    let end: Date;

    if (startDateStr) {
      start = new Date(startDateStr);
    } else {
      start = new Date();
      start.setMonth(start.getMonth() - 1); // default last 1 month
    }

    if (endDateStr) {
      end = new Date(endDateStr);
    } else {
      end = new Date();
    }

    const fees = await this.fiEvFeeRepository.find({
      where: {
        eventId: id,
        createdAt: Between(start, end),
      },
    });

    const tokens = await this.fiEvTokenRepository.find({
      where: {
        eventId: id,
        createdAt: Between(start, end),
      },
    });

    const totalTokenRevenue = tokens.reduce(
      (sum, item) =>
        sum + (Number(item.amount) || 0) * (Number(item.price) || 0),
      0,
    );
    const totalFeeExpenses = fees.reduce(
      (sum, item) => sum + (Number(item.fee) || 0),
      0,
    );

    return {
      eventId: id,
      startDate: start,
      endDate: end,
      totalTokenRevenue,
      totalFeeExpenses,
      profit: totalTokenRevenue - totalFeeExpenses,
    };
  }

  async update(id: number, updateFiEventDto: UpdateFiEventDto) {
    await this.fiEventRepository.update(id, updateFiEventDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    if (event) {
      await this.fiEventRepository.remove(event);
    }
    return { success: true };
  }
}
