import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async findAll() {
    return await this.transactionRepository.find();
  }

  async findOne(id: number) {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const tx = await this.transactionRepository.findOne({ where: { id } });
    if (!tx) {
      throw new Error('Không tìm thấy giao dịch');
    }
    const updated = this.transactionRepository.merge(tx, updateTransactionDto);
    return await this.transactionRepository.save(updated);
  }

  async remove(id: number) {
    const tx = await this.transactionRepository.findOne({ where: { id } });
    if (!tx) {
      throw new Error('Không tìm thấy giao dịch');
    }
    return await this.transactionRepository.remove(tx);
  }
}
