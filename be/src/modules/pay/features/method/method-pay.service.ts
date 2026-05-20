import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMethodPayDto } from '../../dto/method/create-method-pay.dto';
import { UpdateMethodPayDto } from '../../dto/method/update-method-pay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MethodPay, MethodPayType } from '../../entities/method-pay.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MethodPayService {
  constructor(
    @InjectRepository(MethodPay)
    private readonly methodPayRepository: Repository<MethodPay>,
  ) {}

  async create(createMethodPayDto: CreateMethodPayDto, userId?: string) {
    try {
      console.log('Creating MethodPay:', { ...createMethodPayDto, userId });
      const methodPay = this.methodPayRepository.create({
        ...createMethodPayDto,
        userId,
      });
      const saved = await this.methodPayRepository.save(methodPay);
      console.log('Saved MethodPay:', saved);
      return saved;
    } catch (error) {
      console.error('Error in MethodPayService.create:', error);
      throw error;
    }
  }

  findAll() {
    return this.methodPayRepository.find();
  }

  findMine(userId: string) {
    return this.methodPayRepository.find({ where: { userId } });
  }

  findSystem() {
    return this.methodPayRepository.find({
      where: { type: MethodPayType.BINEX },
    });
  }

  async findOne(id: string) {
    const methodPay = await this.methodPayRepository.findOne({ where: { id } });
    if (!methodPay) {
      throw new NotFoundException(
        `Không tìm thấy phương thức thanh toán với ID: ${id}`,
      );
    }
    return methodPay;
  }

  async update(id: string, updateMethodPayDto: UpdateMethodPayDto) {
    const methodPay = await this.findOne(id);
    const updated = Object.assign(methodPay, updateMethodPayDto);
    return this.methodPayRepository.save(updated);
  }

  async remove(id: string) {
    const methodPay = await this.findOne(id);
    return this.methodPayRepository.remove(methodPay);
  }
}
