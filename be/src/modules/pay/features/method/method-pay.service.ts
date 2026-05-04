import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMethodPayDto } from '../../dto/method/create-method-pay.dto';
import { UpdateMethodPayDto } from '../../dto/method/update-method-pay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MethodPay } from '../../entities/method-pay.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MethodPayService {
  constructor(
    @InjectRepository(MethodPay)
    private readonly methodPayRepository: Repository<MethodPay>,
  ) {}

  create(createMethodPayDto: CreateMethodPayDto) {
    const methodPay = this.methodPayRepository.create(createMethodPayDto);
    return this.methodPayRepository.save(methodPay);
  }

  findAll() {
    return this.methodPayRepository.find();
  }

  async findOne(id: string) {
    const methodPay = await this.methodPayRepository.findOne({ where: { id } });
    if (!methodPay) {
      throw new NotFoundException(`Không tìm thấy phương thức thanh toán với ID: ${id}`);
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
