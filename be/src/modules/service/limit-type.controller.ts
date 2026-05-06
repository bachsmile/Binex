import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LimitTypeService } from './limit-type.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateLimitTypeDto } from './dto/create-limit-type.dto';
import { UpdateLimitTypeDto } from './dto/update-limit-type.dto';

@ApiTags('limit-type')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('limit-type')
export class LimitTypeController {
  constructor(private readonly limitTypeService: LimitTypeService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Tạo loại giới hạn mới' })
  create(@Body() data: CreateLimitTypeDto) {
    return this.limitTypeService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách các loại giới hạn' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.limitTypeService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết loại giới hạn' })
  findOne(@Param('id') id: string) {
    return this.limitTypeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cập nhật loại giới hạn' })
  update(@Param('id') id: string, @Body() data: UpdateLimitTypeDto) {
    return this.limitTypeService.update(+id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Xóa loại giới hạn' })
  remove(@Param('id') id: string) {
    return this.limitTypeService.remove(+id);
  }
}
