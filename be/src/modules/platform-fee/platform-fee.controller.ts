import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlatformFeeService } from './platform-fee.service';
import { CreatePlatformFeeDto } from './dto/create-platform-fee.dto';
import { UpdatePlatformFeeDto } from './dto/update-platform-fee.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('platform-fee')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('platform-fee')
export class PlatformFeeController {
  constructor(private readonly platformFeeService: PlatformFeeService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tạo loại phí mới (Super Admin)' })
  create(@Body() createPlatformFeeDto: CreatePlatformFeeDto) {
    return this.platformFeeService.create(createPlatformFeeDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách các loại phí' })
  findAll() {
    return this.platformFeeService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Lấy chi tiết loại phí' })
  findOne(@Param('id') id: string) {
    return this.platformFeeService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật loại phí (Super Admin)' })
  update(
    @Param('id') id: string,
    @Body() updatePlatformFeeDto: UpdatePlatformFeeDto,
  ) {
    return this.platformFeeService.update(id, updatePlatformFeeDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Xóa loại phí (Super Admin)' })
  remove(@Param('id') id: string) {
    return this.platformFeeService.remove(id);
  }
}
