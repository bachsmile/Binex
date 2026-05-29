import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from '../../dto/permission/create-permission.dto';
import { UpdatePermissionDto } from '../../dto/permission/update-permission.dto';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';

@ApiTags('permission')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới một permission cho package' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách permissions' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get('by-pack')
  @ApiOperation({ summary: 'Lấy permissions theo packId' })
  @ApiQuery({ name: 'packId', required: true, description: 'ID của package' })
  findByPackId(@Query('packId') packId: string) {
    return this.permissionService.findByPackId(packId);
  }

  @Get('by-service')
  @ApiOperation({ summary: 'Lấy permissions theo serviceId' })
  @ApiQuery({ name: 'serviceId', required: true, description: 'ID của service' })
  findByServiceId(@Query('serviceId') serviceId: string) {
    return this.permissionService.findByServiceId(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một permission theo ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật permission theo ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một permission theo ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }

  @Delete('by-pack/:packId')
  @ApiOperation({ summary: 'Xóa toàn bộ permissions của một package' })
  removeByPackId(@Param('packId') packId: string) {
    return this.permissionService.removeByPackId(packId);
  }

  @Post('bulk-set')
  @ApiOperation({ summary: 'Gán hàng loạt permissions cho package (thay thế toàn bộ)' })
  bulkSet(
    @Body() body: { packId: string; actions: { action: string; weight?: number }[] },
  ) {
    return this.permissionService.bulkSet(body.packId, body.actions);
  }
}
