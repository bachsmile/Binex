import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WeddingService } from './wedding.service';
import { CreateWeddingDto } from './dto/wedding/create-wedding.dto';
import { UpdateWeddingDto } from './dto/wedding/update-wedding.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('wedding')
@Controller('wedding')
export class WeddingController {
  constructor(private readonly weddingService: WeddingService) {}

  @Post()
  create(@Body() createWeddingDto: CreateWeddingDto) {
    return this.weddingService.create(createWeddingDto);
  }

  @Get()
  findAll() {
    return this.weddingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weddingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWeddingDto: UpdateWeddingDto) {
    return this.weddingService.update(id, updateWeddingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weddingService.remove(id);
  }
}
