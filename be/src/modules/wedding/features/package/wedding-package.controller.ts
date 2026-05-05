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
import { WeddingPackageService } from './wedding-package.service';
import { CreateWeddingPackageDto } from '../../dto/package/create-wedding-package.dto';
import { UpdateWeddingPackageDto } from '../../dto/package/update-wedding-package.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../../../auth/enums/role.enum';

@ApiTags('wedding-package')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard, RolesGuard)
@Controller('wedding-package')
export class WeddingPackageController {
  constructor(private readonly weddingPackageService: WeddingPackageService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Tạo gói dịch vụ wedding mới' })
  create(@Body() createWeddingPackageDto: CreateWeddingPackageDto) {
    return this.weddingPackageService.create(createWeddingPackageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả gói dịch vụ wedding' })
  findAll() {
    return this.weddingPackageService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một gói dịch vụ wedding' })
  findOne(@Param('id') id: string) {
    return this.weddingPackageService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật gói dịch vụ wedding' })
  update(
    @Param('id') id: string,
    @Body() updateWeddingPackageDto: UpdateWeddingPackageDto,
  ) {
    return this.weddingPackageService.update(id, updateWeddingPackageDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Xóa gói dịch vụ wedding' })
  remove(@Param('id') id: string) {
    return this.weddingPackageService.remove(id);
  }
}
