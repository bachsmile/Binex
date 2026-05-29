import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role } from 'src/modules/mn-user/enum/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/mn-user/auth/guards/roles.guard';

@ApiTags('service')
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tạo dịch vụ mới' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách dịch vụ' })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết dịch vụ' })
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật dịch vụ' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Xóa dịch vụ' })
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Put(':id/packages')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh sách package cho service' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        packageIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['01KSH7GFFJ85QK2WH5EW2N5CN7Z'],
          description: 'Danh sách các ID của package muốn gán cho service',
        },
      },
      required: ['packageIds'],
    },
  })
  updatePackages(
    @Param('id') serviceId: string,
    @Body('packageIds') packageIds: string[],
  ) {
    return this.serviceService.updatePackages(serviceId, packageIds);
  }

  @Get(':id/packages')
  @ApiOperation({ summary: 'Lấy danh sách các package thuộc service' })
  @ApiQuery({ name: 'withMicroservices', required: false, type: Boolean, description: 'Có lấy kèm danh sách microservice của package hay không' })
  findPackagesByService(
    @Param('id') serviceId: string,
    @Query('withMicroservices') withMicroservices?: string,
  ) {
    return this.serviceService.findPackagesByService(serviceId, withMicroservices === 'true');
  }

  @Put(':id/microservices')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh sách microservice cho service' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        microIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['01KSM1SWEF102XBJN4KQ05RRXK'],
          description: 'Danh sách các ID của microservice muốn gán cho service',
        },
      },
      required: ['microIds'],
    },
  })
  updateMicroServices(
    @Param('id') serviceId: string,
    @Body('microIds') microIds: string[],
  ) {
    return this.serviceService.updateMicroServices(serviceId, microIds);
  }

  @Get(':id/microservices')
  @ApiOperation({ summary: 'Lấy danh sách các microservice thuộc service' })
  findMicroServicesByService(@Param('id') serviceId: string) {
    return this.serviceService.findMicroServicesByService(serviceId);
  }
}
