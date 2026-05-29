import { Injectable } from '@nestjs/common';
import { CreateFiReportDto } from './dto/create-fi-report.dto';
import { UpdateFiReportDto } from './dto/update-fi-report.dto';

@Injectable()
export class FiReportService {
  create(createFiReportDto: CreateFiReportDto) {
    return 'This action adds a new fiReport';
  }

  findAll() {
    return `This action returns all fiReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fiReport`;
  }

  update(id: number, updateFiReportDto: UpdateFiReportDto) {
    return `This action updates a #${id} fiReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} fiReport`;
  }
}
