import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import {
  ApiQuery,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from 'src/modules/mn-user/enum/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/mn-user/auth/guards/roles.guard';

@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tạo gói (package) mới' })
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packagesService.create(createPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các gói (package)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.packagesService.findAll(Number(page) || 1, Number(limit) || 10);
  }

  @Get('with-microservices')
  @ApiOperation({
    summary:
      'Lấy tất cả các gói (package) kèm theo danh sách microservice của từng gói',
  })
  findAllWithMicroServices() {
    return this.packagesService.findAllWithMicroServices();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết gói (package)' })
  findOne(@Param('id') id: string) {
    return this.packagesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật gói (package)' })
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packagesService.update(id, updatePackageDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Xóa gói (package)' })
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Lấy danh sách các service thuộc gói (package)' })
  findServicesByPackage(@Param('id') packageId: string) {
    return this.packagesService.findServicesByPackage(packageId);
  }

  @Put(':id/microservices')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh sách microservice cho package' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        microIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['01KSM1SWEF102XBJN4KQ05RRXK'],
          description: 'Danh sách các ID của microservice muốn gán cho package',
        },
      },
      required: ['microIds'],
    },
  })
  updateMicroServices(
    @Param('id') packageId: string,
    @Body('microIds') microIds: string[],
  ) {
    return this.packagesService.updateMicroServices(packageId, microIds);
  }

  @Get(':id/microservices')
  @ApiOperation({
    summary: 'Lấy danh sách các microservice thuộc gói (package)',
  })
  findMicroServicesByPackage(@Param('id') packageId: string) {
    return this.packagesService.findMicroServicesByPackage(packageId);
  }
}
