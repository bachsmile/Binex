import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FiEarnService } from './fi-earn.service';
import { CreateFiEarnDto } from './dto/create-fi-earn.dto';
import { UpdateFiEarnDto } from './dto/update-fi-earn.dto';

@Controller('fi-earn')
export class FiEarnController {
  constructor(private readonly fiEarnService: FiEarnService) {}

  @Post()
  create(@Body() createFiEarnDto: CreateFiEarnDto) {
    return this.fiEarnService.create(createFiEarnDto);
  }

  @Get()
  findAll() {
    return this.fiEarnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiEarnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFiEarnDto: UpdateFiEarnDto) {
    return this.fiEarnService.update(+id, updateFiEarnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiEarnService.remove(+id);
  }
}
