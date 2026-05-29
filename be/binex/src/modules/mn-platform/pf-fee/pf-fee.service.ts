import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePfFeeDto } from './dto/create-pf-fee.dto';
import { UpdatePfFeeDto } from './dto/update-pf-fee.dto';
import { FeeType, PfFee } from './entities/pf-fee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PfFeeService {
  constructor(
    @InjectRepository(PfFee)
    private readonly platformFeeRepository: Repository<PfFee>,
  ) {}

  async create(createPlatformFeeDto: CreatePfFeeDto) {
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
    return await this.platformFeeRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const fee = await this.platformFeeRepository.findOne({ where: { id } });
    if (!fee) throw new NotFoundException('Không tìm thấy loại phí này');
    return fee;
  }

  async findByCode(code: string) {
    const fee = await this.platformFeeRepository.findOne({
      where: { code, isActive: true },
    });
    return fee;
  }

  async update(id: string, updatePlatformFeeDto: UpdatePfFeeDto) {
    const fee = await this.findOne(id);
    Object.assign(fee, updatePlatformFeeDto);
    return await this.platformFeeRepository.save(fee);
  }

  async remove(id: string) {
    const fee = await this.findOne(id);
    return await this.platformFeeRepository.remove(fee);
  }

  // Tiện ích tính toán phí
  calculateFee(amount: number, fee: PfFee): number {
    if (fee.type === FeeType.PERCENTAGE) {
      return (amount * Number(fee.value)) / 100;
    }
    return Number(fee.value);
  }
}
