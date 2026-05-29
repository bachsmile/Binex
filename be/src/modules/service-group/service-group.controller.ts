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
import { ServiceGroupService } from './service-group.service';
import { CreateServiceGroupDto } from './dto/create-service-group.dto';
import { UpdateServiceGroupDto } from './dto/update-service-group.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceGroup } from './entities/service-group.entity';
import { ServiceGroupListResponse } from './responses/service-group.response';

@ApiTags('service-group')
@Controller('service-group')
export class ServiceGroupController {
  constructor(private readonly serviceGroupService: ServiceGroupService) {}

  @Post()
  @ApiResponse({ status: 201, type: ServiceGroup })
  create(@Body() createDto: CreateServiceGroupDto) {
    return this.serviceGroupService.create(createDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: ServiceGroupListResponse })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.serviceGroupService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ServiceGroup })
  findOne(@Param('id') id: string) {
    return this.serviceGroupService.findOne(id);
  }

  @Get('user/:userId')
  @ApiResponse({ status: 200, type: String })
  findByUserId(@Param('userId') userId: string) {
    return this.serviceGroupService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: ServiceGroup })
  update(@Param('id') id: string, @Body() updateDto: UpdateServiceGroupDto) {
    return this.serviceGroupService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: ServiceGroup })
  remove(@Param('id') id: string) {
    return this.serviceGroupService.remove(id);
  }

  @Get('priority/:priority')
  @ApiResponse({ status: 200, type: [ServiceGroup] })
  async findWithPriority(@Param('priority') priority: number) {
    const services = await this.serviceGroupService.findAll();
    return services.data.filter((service) => service.priority == priority);
  }
}
