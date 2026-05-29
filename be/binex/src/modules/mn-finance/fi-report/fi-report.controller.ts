import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FiReportService } from './fi-report.service';
import { CreateFiReportDto } from './dto/create-fi-report.dto';
import { UpdateFiReportDto } from './dto/update-fi-report.dto';

@Controller('fi-report')
export class FiReportController {
  constructor(private readonly fiReportService: FiReportService) {}

  @Post()
  create(@Body() createFiReportDto: CreateFiReportDto) {
    return this.fiReportService.create(createFiReportDto);
  }

  @Get()
  findAll() {
    return this.fiReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFiReportDto: UpdateFiReportDto) {
    return this.fiReportService.update(+id, updateFiReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiReportService.remove(+id);
  }
}
