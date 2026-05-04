import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { CreateTransactionDto } from '../../dto/transaction/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async findAllByUserId(userId: string) {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByAddress(address: string) {
    return this.transactionRepository.find({
      where: [
        { fromAddress: address },
        { toAddress: address },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.transactionRepository.findOne({ where: { id } });
  }
}
