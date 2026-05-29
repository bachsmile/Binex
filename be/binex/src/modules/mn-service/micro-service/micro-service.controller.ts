import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MicroServiceService } from './micro-service.service';
import { CreateMicroServiceDto } from './dto/create-micro-service.dto';
import { UpdateMicroServiceDto } from './dto/update-micro-service.dto';
import { ApiQuery, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/modules/mn-user/enum/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/mn-user/auth/guards/roles.guard';

@ApiTags('micro-service')
@Controller('micro-service')
export class MicroServiceController {
  constructor(private readonly microServiceService: MicroServiceService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tạo microservice mới' })
  create(@Body() createMicroServiceDto: CreateMicroServiceDto) {
    return this.microServiceService.create(createMicroServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các microservice' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.microServiceService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết microservice' })
  findOne(@Param('id') id: string) {
    return this.microServiceService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật microservice' })
  update(
    @Param('id') id: string,
    @Body() updateMicroServiceDto: UpdateMicroServiceDto,
  ) {
    return this.microServiceService.update(id, updateMicroServiceDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Xóa microservice' })
  remove(@Param('id') id: string) {
    return this.microServiceService.remove(id);
  }

  @Get(':id/services')
  @ApiOperation({
    summary: 'Lấy danh sách các service đang sử dụng microservice này',
  })
  findServicesByMicroService(@Param('id') id: string) {
    return this.microServiceService.findServicesByMicroService(id);
  }

  @Get(':id/packages')
  @ApiOperation({
    summary: 'Lấy danh sách các package đang sử dụng microservice này',
  })
  findPackagesByMicroService(@Param('id') id: string) {
    return this.microServiceService.findPackagesByMicroService(id);
  }
}
