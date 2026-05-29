import { Injectable } from '@nestjs/common';
import { CreateFiEarnDto } from './dto/create-fi-earn.dto';
import { UpdateFiEarnDto } from './dto/update-fi-earn.dto';

@Injectable()
export class FiEarnService {
  create(createFiEarnDto: CreateFiEarnDto) {
    return 'This action adds a new fiEarn';
  }

  findAll() {
    return `This action returns all fiEarn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fiEarn`;
  }

  update(id: number, updateFiEarnDto: UpdateFiEarnDto) {
    return `This action updates a #${id} fiEarn`;
  }

  remove(id: number) {
    return `This action removes a #${id} fiEarn`;
  }
}
