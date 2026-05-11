import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/service/create-service.dto';
import { UpdateServiceDto } from './dto/service/update-service.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Service } from './entities/service.entity';
import { ServiceListResponse } from './responses/service.response';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiResponse({ status: 201, type: Service })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: ServiceListResponse })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.serviceService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Service })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Get('user/:userId')
  @ApiResponse({ status: 200, type: String })
  findByUserId(@Param('userId') userId: string) {
    return this.serviceService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: Service })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: Service })
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Get('priority/:priority')
  @ApiResponse({ status: 200, type: [Service] })
  async findWithPriority(@Param('priority') priority: number) {
    const services = await this.serviceService.findAll();
    return services.data.filter((service) => service.priority == priority);
  }
}
