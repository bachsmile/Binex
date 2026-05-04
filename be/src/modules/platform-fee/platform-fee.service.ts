import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformFee, FeeType } from './entities/platform-fee.entity';
import { CreatePlatformFeeDto } from './dto/create-platform-fee.dto';
import { UpdatePlatformFeeDto } from './dto/update-platform-fee.dto';

@Injectable()
export class PlatformFeeService {
  constructor(
    @InjectRepository(PlatformFee)
    private readonly platformFeeRepository: Repository<PlatformFee>,
  ) {}

  async create(createPlatformFeeDto: CreatePlatformFeeDto) {
    const existing = await this.platformFeeRepository.findOne({
      where: { code: createPlatformFeeDto.code },
    });
    if (existing) {
      throw new ConflictException('Mã phí này đã tồn tại');
    }
    const fee = this.platformFeeRepository.create(createPlatformFeeDto);
    return await this.platformFeeRepository.save(fee);
  }

  async findAll() {
    return await this.platformFeeRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const fee = await this.platformFeeRepository.findOne({ where: { id } });
    if (!fee) throw new NotFoundException('Không tìm thấy loại phí này');
    return fee;
  }

  async findByCode(code: string) {
    const fee = await this.platformFeeRepository.findOne({ where: { code, isActive: true } });
    return fee;
  }

  async update(id: string, updatePlatformFeeDto: UpdatePlatformFeeDto) {
    const fee = await this.findOne(id);
    Object.assign(fee, updatePlatformFeeDto);
    return await this.platformFeeRepository.save(fee);
  }

  async remove(id: string) {
    const fee = await this.findOne(id);
    return await this.platformFeeRepository.remove(fee);
  }

  // Tiện ích tính toán phí
  calculateFee(amount: number, fee: PlatformFee): number {
    if (fee.type === FeeType.PERCENTAGE) {
      return (amount * Number(fee.value)) / 100;
    }
    return Number(fee.value);
  }
}
