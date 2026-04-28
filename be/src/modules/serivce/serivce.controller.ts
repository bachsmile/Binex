import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SerivceService } from './serivce.service';
import { CreateSerivceDto } from './dto/create-serivce.dto';
import { UpdateSerivceDto } from './dto/update-serivce.dto';

@Controller('serivce')
export class SerivceController {
  constructor(private readonly serivceService: SerivceService) {}

  @Post()
  create(@Body() createSerivceDto: CreateSerivceDto) {
    return this.serivceService.create(createSerivceDto);
  }

  @Get()
  findAll() {
    return this.serivceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serivceService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.serivceService.findByUserId(userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSerivceDto: UpdateSerivceDto) {
    return this.serivceService.update(id, updateSerivceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serivceService.remove(id);
  }

  @Get('priority/:priority')
  async findWithPriority(@Param('priority') priority: number) {
    const services = await this.serivceService.findAll();
    return services.filter((service) => service.priority === priority);
  }
}
