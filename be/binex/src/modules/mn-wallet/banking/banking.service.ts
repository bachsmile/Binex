import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBankingDto } from './dto/create-banking.dto';
import { UpdateBankingDto } from './dto/update-banking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banking } from './entities/banking.entity';
import { Repository } from 'typeorm';
import { TypeBank } from './enum/type.enum';
import { generateHash } from 'src/common/utils/string.utils';
import { BANK_AND_WALLET_OPTIONS } from 'src/constants/banking.constants';

@Injectable()
export class BankingService {
  constructor(
    @InjectRepository(Banking)
    private bankingRepository: Repository<Banking>,
  ) {}
  async create(createBankingDto: CreateBankingDto) {
    const banking = await this.bankingRepository.findOne({
      where: {
        userId: createBankingDto.userId,
        type: createBankingDto.type,
      },
    });
    if (
      banking &&
      ((createBankingDto.type === TypeBank.ACCOUNT_NUMBER &&
        banking.bankNumber === createBankingDto.bankNumber) ||
        (createBankingDto.type === TypeBank.CARD_NUMBER &&
          banking.cardNumber === createBankingDto.cardNumber))
    ) {
      throw new BadRequestException('Ngân hàng đã tồn tại');
    }

    const address = generateHash('bio');
    const newBanking = this.bankingRepository.create({
      ...createBankingDto,
      address,
    });
    return this.bankingRepository.save(newBanking);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [result, total] = await this.bankingRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  findOne(id: string) {
    return this.bankingRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(updateBankingDto: UpdateBankingDto) {
    const banking = await this.bankingRepository.findOne({
      where: { id: updateBankingDto.id },
    });
    if (!banking) {
      throw new BadRequestException('Ngân hàng không tồn tại');
    }
    const updateBanking = this.bankingRepository.merge(
      banking,
      updateBankingDto,
    );
    return this.bankingRepository.save(updateBanking);
  }

  async remove(id: string) {
    const banking = await this.bankingRepository.findOne({
      where: { id },
    });
    if (!banking) {
      throw new BadRequestException('Ngân hàng không tồn tại');
    }
    return this.bankingRepository.remove(banking);
  }

  getOptions() {
    return BANK_AND_WALLET_OPTIONS;
  }
}
