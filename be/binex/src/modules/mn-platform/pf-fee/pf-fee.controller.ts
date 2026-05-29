import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PfFeeService } from './pf-fee.service';
import { AuthGuard } from 'src/modules/mn-user/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/mn-user/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/mn-user/enum/role.enum';
import { CreatePfFeeDto } from './dto/create-pf-fee.dto';
import { UpdatePfFeeDto } from './dto/update-pf-fee.dto';

@ApiTags('pf-fee')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('pf-fee')
export class PfFeeController {
  constructor(private readonly platformFeeService: PfFeeService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tạo loại phí mới (Super Admin)' })
  create(@Body() createPlatformFeeDto: CreatePfFeeDto) {
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
    @Body() updatePlatformFeeDto: UpdatePfFeeDto,
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
